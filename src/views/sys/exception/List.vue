<template>
  <e-pro-table title="异常日志" :advanced.sync="advanced">
    <template slot="query">
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="错误代码">
          <a-input v-model="queryParam.code"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="错误类型">
          <a-input v-model="queryParam.type"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="访问地址">
          <a-input v-model="queryParam.url"/>
        </a-form-model-item>
      </a-col>
      <template v-if="advanced">
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="触发用户">
            <a-input v-model="queryParam.nickname"/>
          </a-form-model-item>
        </a-col>
      </template>
    </template>

    <template slot="button">
      <e-btn-remove-batch :ids="selectedRowKeys" :click-callback="remove"/>
    </template>

    <template slot="table">
      <s-table
        ref="table"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <e-btn-info :to="`/sys/exception/input`" :tab-name="record.message" :id="record.id"/>
            <btn-remove :id="record.id" :divider="false" :on-click="remove"/>
          </template>
        </span>
      </s-table>
    </template>
  </e-pro-table>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, remove } from '@/api/sys/exception'
import BtnRemove from '@/components/Easy/general/BtnRemove'
import EBtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import EProTable from '@/components/Easy/data-display/ProTable'
import EBtnInfo from '@/components/Easy/general/BtnInfo'
import { formatDate } from '@/utils/util'

const columns = [
  {
    title: '错误代码',
    dataIndex: 'code',
    sorter: true,
    width: 100
  },
  {
    title: '异常类型',
    dataIndex: 'type',
    sorter: true,
    width: 360
  },
  {
    title: '错误信息',
    dataIndex: 'message',
    sorter: true,
    width: 360
  },
  {
    title: '请求地址',
    dataIndex: 'url',
    sorter: true,
    width: 240
  },
  {
    title: '触发时间',
    dataIndex: 'triggerTime',
    sorter: true,
    width: 170,
    customRender: (text) => formatDate(text)
  },
  {
    title: '触发用户',
    dataIndex: 'nickname',
    sorter: true,
    width: 140
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SysExceptionList',
  components: {
    EBtnInfo,
    EProTable,
    EBtnRemoveBatch,
    BtnRemove,
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // 高级搜索 展开/关闭
      advanced: false,
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
    // 加载数据方法 必须为 Promise 对象
    loadData (parameter) {
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      return select(requestParameters)
        .then(res => {
          return res.data
        })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    remove (id) {
      remove(id).then(res => {
        this.$refs.table.refresh(true)
      })
    }
  }
}
</script>
