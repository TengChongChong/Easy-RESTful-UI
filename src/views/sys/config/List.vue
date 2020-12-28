<template>
  <e-pro-table title="系统参数" :advanced.sync="advanced">
    <template slot="query">
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="key">
          <a-input v-model="queryParam.sysKey"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="value">
          <a-input v-model="queryParam.value"/>
        </a-form-model-item>
      </a-col>
      <template v-if="advanced">
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="类型">
            <e-dict-select type="dataType" v-model="queryParam.type" @change="$refs.table.refresh(true)"/>
          </a-form-model-item>
        </a-col>
      </template>
    </template>

    <template slot="button">
      <e-btn-add to="/sys/config/add"/>
      <a-button type="primary" icon="sync" @click="refreshCache">更新缓存数据</a-button>
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
        <span slot="type" slot-scope="text, record">
          <e-dict-tag type="dataType" :code="record.type"/>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <e-btn-edit :to="`/sys/config/input`" :tab-name="record.key" :id="record.id"/>
            <e-btn-remove :id="record.id" :divider="false" :on-click="remove"/>
          </template>
        </span>
      </s-table>
    </template>
  </e-pro-table>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, remove, refreshCache } from '@/api/sys/config'
import EDictTag from '@/components/Easy/data-entry/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EBtnAddSub from '@/components/Easy/general/BtnAddSub'
import EBtnAdd from '@/components/Easy/general/BtnAdd'
import EBtnEdit from '@/components/Easy/general/BtnEdit'
import EBtnRemove from '@/components/Easy/general/BtnRemove'
import { successTip } from '@/utils/tips'
import EBtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import EProTable from '@/components/Easy/data-display/ProTable'

const columns = [
  {
    title: 'sysKey',
    dataIndex: 'sysKey',
    width: 300,
    sorter: true
  },
  {
    title: 'value',
    dataIndex: 'value',
    width: 300,
    sorter: true
  },
  {
    title: '类型',
    dataIndex: 'type',
    sorter: true,
    width: 200,
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '备注',
    dataIndex: 'tips',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SysDictList',
  components: {
    EProTable,
    EBtnRemoveBatch,
    EBtnRemove,
    EBtnEdit,
    EBtnAdd,
    EBtnAddSub,
    EDictSelect,
    EDictTag,
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
    },
    refreshCache () {
      refreshCache().then(res => {
        successTip()
      })
    }
  }
}
</script>
