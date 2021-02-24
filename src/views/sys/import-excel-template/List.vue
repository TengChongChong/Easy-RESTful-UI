<template>
  <e-pro-table title="导入模板" :no-advanced="true">
    <template slot="query">
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="名称">
          <a-input v-model="queryParam.name"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="模板代码">
          <a-input v-model="queryParam.importCode"/>
        </a-form-model-item>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
        <a-form-model-item label="导入表">
          <a-select
            show-search
            option-filter-prop="children"
            @change="$refs.eTable.refresh(true)"
            v-model="queryParam.importTable">
            <a-select-option v-for="item in tableList" :key="item.value">
              {{ item.value }} - {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </template>

    <template slot="button">
      <e-btn-add :permissions="SYS_PERMISSIONS_CODE.SYS_IMPORT_EXCEL_TEMPLATE_SAVE" to="/sys/import-excel-template/input"/>
      <e-btn-remove-batch :permissions="SYS_PERMISSIONS_CODE.SYS_IMPORT_EXCEL_TEMPLATE_REMOVE" :loading.sync="removeBathLoading" :ids="selectedRowKeys" :click-callback="remove"/>
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
        <span slot="action" slot-scope="text, record">
          <template>
            <e-btn-edit :permissions="SYS_PERMISSIONS_CODE.SYS_IMPORT_EXCEL_TEMPLATE_SAVE" :to="`/sys/import-excel-template/input`" :tab-name="record.key" :id="record.id"/>
            <a-tooltip placement="top">
              <template slot="title">
                <span>编辑导入规则</span>
              </template>
              <a-button size="small" icon="setting" @click="editImportExcelTemplateDetails(record.id, record.name)"/>
            </a-tooltip>
            <a-divider type="vertical"/>
            <e-btn-remove :permissions="SYS_PERMISSIONS_CODE.SYS_IMPORT_EXCEL_TEMPLATE_REMOVE" :id="record.id" :click-callback="remove"/>
            <a-tooltip placement="top">
              <template slot="title">
                <span>下载模板</span>
              </template>
              <a-button size="small" icon="download" @click="downloadTemplate(record.importCode)"/>
            </a-tooltip>
          </template>
        </span>
      </s-table>
    </template>
  </e-pro-table>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, remove, downloadTemplate } from '@/api/sys/import-excel-template'
import EDictTag from '@/components/Easy/data-display/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EBtnAdd from '@/components/Easy/general/BtnAdd'
import EBtnEdit from '@/components/Easy/general/BtnEdit'
import EBtnRemove from '@/components/Easy/general/BtnRemove'
import EBtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import EProTable from '@/components/Easy/data-display/ProTable'
import { SYS_PERMISSIONS_CODE } from '@/utils/const/sys/PermissionsCode'
import { selectTable } from '@/api/generator'
import { downloadFileById, openView } from '@/utils/util'

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 160,
    sorter: true
  },
  {
    title: '模板代码',
    dataIndex: 'importCode',
    width: 160,
    sorter: true
  },
  {
    title: '权限标识',
    dataIndex: 'permissionCode',
    sorter: true,
    width: 160
  },
  {
    title: '导入表',
    dataIndex: 'importTable',
    width: 160,
    sorter: true
  },
  {
    title: '回调Class',
    dataIndex: 'callback',
    width: 200,
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 180,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SysImportExcelTemplateList',
  components: {
    EProTable,
    EBtnRemoveBatch,
    EBtnRemove,
    EBtnEdit,
    EBtnAdd,
    EDictSelect,
    EDictTag,
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      SYS_PERMISSIONS_CODE: SYS_PERMISSIONS_CODE,

      // 查询参数
      tableList: [],
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
  mounted () {
    selectTable().then(res => {
      this.tableList = res.data
    })
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
        this.$refs.eTable.refresh(true)
        this.removeBathLoading = false
      }).catch(({ response }) => {
        this.removeBathLoading = false
      })
    },
    editImportExcelTemplateDetails (id, name) {
      openView(this.$router, `/sys/import-excel-template-details/input?id=${id}`, `导入规则：${name}`)
    },
    /**
     * 下载模板
     *
     * @param importCode {string} 模板代码
     */
    downloadTemplate (importCode) {
      downloadTemplate(importCode).then(res => {
        downloadFileById(res.data)
      })
    }
  }
}
</script>
