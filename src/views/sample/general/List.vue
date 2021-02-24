<template>
  <!-- 如无需展开查询，请移除:advanced.sync="advanced"并添加:no-advanced="true" -->
  <e-pro-table title="代码生成示例" :advanced.sync="advanced">
    <template slot="query">
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="姓名">
          <a-input v-model="queryParam.name"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="性别">
          <e-dict-select type="sex" v-model="queryParam.sex" @change="$refs.eTable.refresh(true)"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="年龄">
          <a-input-number v-model="queryParam.age"/>
        </a-form-model-item>
      </a-col>
      <template v-if="advanced">
        <!-- 点击展开显示的查询条件 -->
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="手机号码">
            <a-input v-model="queryParam.phone"/>
          </a-form-model-item>
        </a-col>
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="状态">
            <e-dict-select type="commonStatus" v-model="queryParam.status" @change="$refs.eTable.refresh(true)"/>
          </a-form-model-item>
        </a-col>
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="地址">
            <a-input v-model="queryParam.address"/>
          </a-form-model-item>
        </a-col>
      </template>
    </template>

    <template slot="button">
      <e-btn-add permissions="sample:general:save" to="/sample/general/input"/>
      <e-btn-remove-batch permissions="sample:general:remove" :loading.sync="removeBathLoading" :ids="selectedRowKeys" :click-callback="remove"/>
      <e-btn-import import-code="sample:general"/>
      <a-button icon="download" @click="exportData">导出数据</a-button>
    </template>

    <template slot="table">
      <s-table
        ref="eTable"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="sex" slot-scope="text">
          <e-dict-tag type="sex" :code="text"/>
        </span>
        <span slot="status" slot-scope="text">
          <e-dict-tag type="commonStatus" :code="text"/>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <e-btn-edit permissions="sample:general:save" :to="`/sample/general/input`" :tab-name="record.key" :id="record.id"/>
            <e-btn-remove permissions="sample:general:remove" :id="record.id" :divider="false" :click-callback="remove"/>
          </template>
        </span>
      </s-table>
    </template>
  </e-pro-table>
</template>

<script>
import { select, remove, exportData } from '@/api/sample/general'
import { downloadFileById } from '@/utils/util'
import { STable, Ellipsis } from '@/components'
import EProTable from '@/components/Easy/data-display/ProTable'
import EBtnAdd from '@/components/Easy/general/BtnAdd'
import EBtnEdit from '@/components/Easy/general/BtnEdit'
import EBtnRemove from '@/components/Easy/general/BtnRemove'
import EBtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import EDictTag from '@/components/Easy/data-display/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EBtnImport from '@/components/Easy/general/BtnImport'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: 100,
    sorter: true
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 100,
    sorter: true,
    scopedSlots: { customRender: 'sex' }
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 100,
    sorter: true
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    width: 100,
    sorter: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    sorter: true,
    scopedSlots: { customRender: 'status' }
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
  name: 'SampleGeneralList',
  components: {
    STable,
    Ellipsis,
    EProTable,
    EBtnAdd,
    EBtnEdit,
    EBtnRemove,
    EBtnRemoveBatch,
    EDictTag,
    EDictSelect,
    EBtnImport
  },
  data () {
    this.columns = columns
    return {

      // 查询参数
      advanced: false,
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      removeBathLoading: false
    }
  },
  activated () {
    this.$refs.eTable.refresh(true)
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
    exportData () {
      exportData(this.queryParam).then(res => {
        downloadFileById(res.data)
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    remove (id) {
      remove(id).then(res => {
        this.$refs.eTable.refresh(true)
        this.removeBathLoading = false
      }).catch(({ response }) => {
        this.removeBathLoading = false
      })
    }
  }
}
</script>
