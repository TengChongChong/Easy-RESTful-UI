<template>
  <div>
    <a-row :gutter="24" style="margin-bottom: 15px">
      <a-col :lg="12" :sm="24">
        <e-btn-remove-batch>彻底删除</e-btn-remove-batch>
      </a-col>
      <a-col :lg="12" :sm="24" style="text-align: right">
        <a-input-search placeholder="输入关键字搜索" style="width: 200px" @search="onSearch" />
      </a-col>
    </a-row>
    <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
      :alert="true"
      showPagination="auto"
    >
      <span slot="class" slot-scope="text, record">
        {{ record.clazz }}.{{ record.methodName }}()
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <e-btn-info :to="`/sys/log/input`" :tab-name="record.method || record.modular" :id="record.id" :divider="false"/>
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

const columns = [
  {
    title: '标星',
    dataIndex: 'star',
    sorter: true,
    width: 100
  },
  {
    title: '发送人',
    dataIndex: 'createUser',
    sorter: true,
    width: 100
  },
  {
    title: '重要',
    dataIndex: 'important',
    sorter: true,
    width: 100
  },
  {
    title: '主题',
    dataIndex: 'title',
    sorter: true,
    width: 260
  },
  {
    title: '类型',
    dataIndex: 'type',
    sorter: true,
    width: 100
  },
  {
    title: '时间',
    dataIndex: 'sendDate',
    sorter: true,
    width: 160
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 60,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    EBtnRemoveBatch,
    EBtnRemove,
    EBtnInfo,
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // 查询参数
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  activated () {
    this.$refs.table.refresh(true)
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 加载数据方法 必须为 Promise 对象
    loadData (parameter) {
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      return selectReceive(requestParameters)
        .then(res => {
          return res.data
        })
    },
    onSearch () {

    }
  }
}
</script>
