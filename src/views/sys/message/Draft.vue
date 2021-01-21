<template>
  <div>
    <a-row :gutter="16" style="margin-bottom: 15px">
      <a-col :lg="12" :sm="24">
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
        <a-button type="link" @click="edit(record.id)">{{ text }}</a-button>
      </span>
      <span slot="type" slot-scope="text">
        <e-dict-tag type="messageType" :code="text"/>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-tooltip placement="top">
          <template slot="title">
            <span>编辑</span>
          </template>
          <a-button type="primary" size="small" icon="edit" @click="edit(record.id)"/>
        </a-tooltip>
        <a-divider type="vertical" />
        <a-tooltip placement="top">
          <template slot="title">
            <span>发送</span>
          </template>
          <a-button type="primary" size="small" icon="check-circle" @click="send(record.id)"/>
        </a-tooltip>
        <a-divider type="vertical" />
        <e-btn-remove :id="record.id" :click-callback="remove" :divider="false"/>
      </span>
    </s-table>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, send, remove } from '@/api/sys/message'
import EBtnInfo from '@/components/Easy/general/BtnInfo'
import EBtnRemove from '@/components/Easy/general/BtnRemove'
import EDictTag from '@/components/Easy/data-entry/DictTag'
import { MESSAGE_CONST } from '@/utils/const/sys/MessageConst'
import { formatDate } from '@/utils/util'
import EBtnEdit from '@/components/Easy/general/BtnEdit'
import { successTip } from '@/utils/tips'

const columns = [
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
    title: '创建时间',
    dataIndex: 'createDate',
    sorter: true,
    width: 160,
    customRender: (text) => formatDate(text)
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 130,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  props: {
    setCurrentMenu: {
      type: Function,
      default: () => {}
    },
    setId: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    EBtnEdit,
    EDictTag,
    EBtnRemove,
    EBtnInfo,
    STable,
    Ellipsis
  },
  watch: {
    status: function (newPathKey) {
      this.status = newPathKey
      this.$refs.eTable.refresh(true)
    }
  },
  data () {
    this.columns = columns
    return {
      // 查询参数
      queryParam: {},
      MESSAGE_CONST: MESSAGE_CONST
    }
  },
  activated () {
    this.$refs.eTable.refresh(true)
  },
  methods: {
    // 加载数据方法 必须为 Promise 对象
    loadData (parameter) {
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      requestParameters.status = MESSAGE_CONST.STATUS_DRAFT
      return select(requestParameters)
        .then(res => {
          return res.data
        })
    },
    send (id) {
      send(id).then(res => {
        successTip()
        this.$refs.eTable.refresh(true)
      })
    },
    onSearch () {
      this.$refs.eTable.refresh(true)
    },
    edit (id) {
      this.setCurrentMenu('input')
      this.setId(id)
    },
    remove (id) {
      remove(id).then(res => {
        this.$refs.eTable.refresh(true)
      })
    }
  }
}
</script>
