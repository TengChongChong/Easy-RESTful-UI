<template>
  <div>
    <a-row :gutter="16" style="margin-bottom: 15px">
      <a-col :lg="12" :sm="24">
        <e-btn-remove-batch>彻底删除</e-btn-remove-batch>
      </a-col>
      <a-col :lg="12" :sm="24" style="text-align: right">
        <a-input-search v-model="queryParam.title" placeholder="输入关键字搜索" style="width: 200px" @search="onSearch"/>
      </a-col>
    </a-row>
    <s-table
      ref="eTable"
      :columns="columns"
      :data="loadData"
      :alert="true"
      showPagination="auto"
    >
      <span slot="m-title" slot-scope="text, record">
        <a-tag v-if="MESSAGE_CONST.IMPORTANT_YES === record.important" color="red">重要</a-tag>
        <a-button
          :class="record.readDate == null ? 'unread' : ''"
          type="link"
          @click="info(record.id, record.messageId)">{{ text }}</a-button>
      </span>
      <span slot="star" slot-scope="text, record">
        <a-icon v-if="MESSAGE_CONST.STAR_NO === text" type="star" @click="setStar(record.id, true)"/>
        <a-icon v-if="MESSAGE_CONST.STAR_YES === text" type="star" theme="filled" @click="setStar(record.id, false)"/>
      </span>
      <span slot="type" slot-scope="text">
        <e-dict-tag type="messageType" :code="text"/>
      </span>
      <span slot="createUser" slot-scope="text, record">
        <e-avatar :avatar="record.avatar" :nickname="record.nickname"/>
        {{ record.nickname }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="status !== MESSAGE_CONST.RECEIVE_STATUS_DELETED">
          <a-tooltip placement="top">
            <template slot="title">
              <span>查看</span>
            </template>
            <a-button type="primary" size="small" icon="search" @click="info(record.id, record.messageId)"/>
          </a-tooltip>
          <a-divider type="vertical"/>
          <e-btn-remove :click-callback="remove" :id="record.id" :divider="false"/>
        </template>
        <template v-if="status === MESSAGE_CONST.RECEIVE_STATUS_DELETED">
          <a-tooltip placement="top">
            <template slot="title">
              <span>还原</span>
            </template>
            <a-button type="primary" size="small" icon="reload" @click="reductionByIds(record.id)"/>
          </a-tooltip>
          <a-divider type="vertical"/>
          <e-btn-remove :click-callback="remove" :id="record.id" :divider="false"/>
        </template>
      </span>
    </s-table>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { selectReceive } from '@/api/sys/message'
import EBtnInfo from '@/components/Easy/general/BtnInfo'
import EBtnRemove from '@/components/Easy/general/BtnRemove'
import EBtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import { formatDate } from '@/utils/util'
import { MESSAGE_CONST } from '@/utils/const/sys/MessageConst'
import EDictTag from '@/components/Easy/data-display/DictTag'
import { reductionByIds, removeByIds, setStar } from '@/api/sys/message-details'
import EAvatar from '@/components/Easy/data-display/Avatar'

const columns = [
  {
    title: '标星',
    dataIndex: 'star',
    sorter: true,
    width: 100,
    scopedSlots: { customRender: 'star' }
  },
  {
    title: '主题',
    dataIndex: 'title',
    sorter: true,
    width: 320,
    scopedSlots: { customRender: 'm-title' }
  },
  {
    title: '类型',
    dataIndex: 'type',
    sorter: true,
    width: 100,
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '发送人',
    dataIndex: 'createUser',
    sorter: true,
    width: 160,
    scopedSlots: { customRender: 'createUser' }
  },
  {
    title: '发送时间',
    dataIndex: 'sendDate',
    sorter: true,
    width: 160,
    customRender: (text) => formatDate(text)
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 90,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  props: {
    setCurrentMenu: {
      type: Function,
      default: () => {
      }
    },
    setMessageId: {
      type: Function,
      default: () => {
      }
    },
    setId: {
      type: Function,
      default: () => {
      }
    },
    status: {
      type: String,
      default: null
    },
    star: {
      type: Number,
      default: null
    }
  },
  components: {
    EAvatar,
    EDictTag,
    EBtnRemoveBatch,
    EBtnRemove,
    EBtnInfo,
    STable,
    Ellipsis
  },
  watch: {
    status: function (newPathKey) {
      this.status = newPathKey
      this.$refs.eTable.refresh(true)
    },
    star: function (newPathKey) {
      this.star = newPathKey
      this.$refs.eTable.refresh(true)
    }
  },
  data () {
    this.columns = columns
    return {
      MESSAGE_CONST: MESSAGE_CONST,
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
      // 查询参数
      queryParam: {}
    }
  },
  activated () {
    this.$refs.eTable.refresh(true)
  },
  methods: {
    // 加载数据方法 必须为 Promise 对象
    loadData (parameter) {
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      requestParameters.detailsStatus = this.status
      requestParameters.star = this.star
      return selectReceive(requestParameters)
        .then(res => {
          return res.data
        })
    },
    onSearch () {
      this.$refs.eTable.refresh(true)
    },
    /**
     * 设置消息标星/取消标星
     *
     * @param id   接受消息id
     * @param type true/false 是否标星
     */
    setStar (id, type) {
      setStar(id, type).then(res => {
        this.$refs.eTable.refresh(true)
      })
    },
    /**
     * 根据接收消息id删除
     *
     * @param id 消息id
     */
    remove (id) {
      removeByIds(id, this.status === MESSAGE_CONST.RECEIVE_STATUS_DELETED).then(res => {
        this.$refs.eTable.refresh(true)
      })
    },
    /**
     * 根据接收消息id恢复
     *
     * @param id 消息id
     * @return true/false
     */
    reductionByIds (id) {
      reductionByIds(id).then(res => {
        this.$refs.eTable.refresh(true)
      })
    },
    info (id, messageId) {
      this.setCurrentMenu('info')
      this.setId(id)
      this.setMessageId(messageId)
    }
  }
}
</script>
