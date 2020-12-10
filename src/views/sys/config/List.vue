<template>
  <pro-table title="系统参数" :advanced.sync="advanced">
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
            <dict-select type="dataType" v-model="queryParam.type" @change="$refs.table.refresh(true)"></dict-select>
          </a-form-model-item>
        </a-col>
      </template>
    </template>

    <template slot="button">
      <btn-add to="/sys/config/add"></btn-add>
      <a-button type="primary" icon="sync" @click="refreshCache">更新缓存数据</a-button>
      <btn-remove-batch :ids="selectedRowKeys" :on-click="remove"/>
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
          <dict-tag type="dataType" :code="record.type"></dict-tag>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <btn-edit :to="`/sys/config/input`" :tab-name="record.name" :id="record.id"></btn-edit>
            <btn-remove :id="record.id" :divider="false" :on-click="remove"></btn-remove>
          </template>
        </span>
      </s-table>
    </template>
  </pro-table>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, remove, refreshCache } from '@/api/sys/config'
import DictTag from '@/components/Easy/data-entry/DictTag'
import DictSelect from '@/components/Easy/data-entry/DictSelect'
import ProTable from '@/components/ProTable/Index'
import BtnAddSub from '@/components/Easy/general/BtnAddSub'
import BtnAdd from '@/components/Easy/general/BtnAdd'
import BtnEdit from '@/components/Easy/general/BtnEdit'
import BtnRemove from '@/components/Easy/general/BtnRemove'
import { successTip } from '@/utils/tips'
import BtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'

const columns = [
  {
    title: 'sysKey',
    dataIndex: 'sysKey',
    sorter: true
  },
  {
    title: 'value',
    dataIndex: 'value',
    sorter: true
  },
  {
    title: '类型',
    dataIndex: 'type',
    sorter: true,
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
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SysDictList',
  components: {
    BtnRemoveBatch,
    BtnRemove,
    BtnEdit,
    BtnAdd,
    BtnAddSub,
    ProTable,
    DictSelect,
    DictTag,
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
      allowClear: true,
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    this.loadDictTypes()
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
