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
        <a-button type="link" @click="info(record.id)">{{ text }}</a-button>
      </span>
      <span slot="type" slot-scope="text">
        <e-dict-tag type="messageType" :code="text"/>
      </span>
    </s-table>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select } from '@/api/sys/message'
import EBtnInfo from '@/components/Easy/general/BtnInfo'
import EDictTag from '@/components/Easy/data-display/DictTag'
import { MESSAGE_CONST } from '@/utils/const/sys/MessageConst'
import { formatDate } from '@/utils/util'

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
    title: '发送时间',
    dataIndex: 'sendDate',
    sorter: true,
    width: 160,
    customRender: (text) => formatDate(text)
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
    }
  },
  components: {
    EDictTag,
    EBtnInfo,
    STable,
    Ellipsis
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
      requestParameters.status = MESSAGE_CONST.STATUS_HAS_BEEN_SENT
      return select(requestParameters)
        .then(res => {
          return res.data
        })
    },
    onSearch () {
      this.$refs.eTable.refresh(true)
    },
    info (messageId) {
      this.setCurrentMenu('info')
      this.setMessageId(messageId)
    }
  }
}
</script>
