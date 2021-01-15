<template>
  <div>
    <e-pro-table title="流程模型" :no-advanced="true">
      <template slot="query">
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="名称">
            <a-input v-model="queryParam.name"/>
          </a-form-model-item>
        </a-col>
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="标识">
            <a-input v-model="queryParam.key"/>
          </a-form-model-item>
        </a-col>
      </template>

      <template slot="button">
        <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
        <e-btn-remove-batch :loading="removeBathLoading" :ids="selectedRowKeys" :click-callback="remove"/>
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
          <span slot="version" slot-scope="text">
            <a-tag color="blue">v.{{ text }}</a-tag>
          </span>
          <span slot="action" slot-scope="text, record">
            <template>
              <e-btn-edit :to="`/iframe?path=/activiti-editor/modeler.html?modelId=${record.id}`" :tab-name="record.name"/>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>部署</span>
                </template>
                <a-button type="primary" size="small" icon="check" @click="deploymentProcess(record.id)"/>
              </a-tooltip>
              <a-divider type="vertical" />
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <a-button size="small" icon="download" @click="exportModel(record.id)"/>
              </a-tooltip>
              <a-divider type="vertical" />
              <e-btn-remove :id="record.id" :divider="false" :click-callback="remove"/>
            </template>
          </span>
        </s-table>
      </template>
    </e-pro-table>
    <a-modal v-model="addModalVisible" title="新增模型" @ok="saveData" okText="保存并关闭">
      <a-form-model
        ref="form"
        :model="model"
        :rules="rules"
        :label-col="formLayout.labelCol"
        :wrapper-col="formLayout.wrapperCol">
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="model.name"/>
        </a-form-model-item>
        <a-form-model-item label="标识" prop="key">
          <a-input v-model="model.key"/>
        </a-form-model-item>
        <a-form-model-item label="模型文件" prop="path">
          <e-upload v-model="fileList" accept=".xml"/>
        </a-form-model-item>
        <a-form-model-item label="描述" prop="description">
          <a-textarea v-model="model.description"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, remove, save, deploymentProcess, exportModel } from '@/api/activiti/model'
import EDictTag from '@/components/Easy/data-entry/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EBtnAdd from '@/components/Easy/general/BtnAdd'
import EBtnEdit from '@/components/Easy/general/BtnEdit'
import EBtnRemove from '@/components/Easy/general/BtnRemove'
import EBtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import EProTable from '@/components/Easy/data-display/ProTable'
import { downloadFileById, formatDate } from '@/utils/util'
import { FORM_LAYOUT } from '@/utils/const/form'
import { saveSuccessTip, successTip } from '@/utils/tips'
import EUpload from '@/components/Easy/data-entry/Upload'

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    sortField: 'arm.name_',
    width: 100,
    sorter: true
  },
  {
    title: '标识',
    dataIndex: 'key',
    sortField: 'arm.key_',
    width: 100,
    sorter: true
  },
  {
    title: '版本号',
    dataIndex: 'version',
    sortField: 'arm.version_',
    sorter: true,
    width: 100,
    scopedSlots: { customRender: 'version' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sortField: 'arm.create_time_',
    sorter: true,
    width: 170,
    customRender: (text) => formatDate(text)
  },
  {
    title: '最后更新时间',
    dataIndex: 'lastUpdateTime',
    sortField: 'arm.last_update_time_',
    sorter: true,
    width: 170,
    customRender: (text) => formatDate(text)
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
  name: 'ActivitiModelList',
  components: {
    EUpload,
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
      // 查询参数
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      removeBathLoading: false,

      // 新增窗口
      addModalVisible: false,
      formLayout: FORM_LAYOUT,
      fileList: [
      ],
      model: {},
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 50, message: '名称字数不能超过50个字符', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入标识', trigger: 'blur' },
          { max: 50, message: '标识字数不能超过50个字符', trigger: 'blur' }
        ],
        description: [
          { max: 250, message: '描述字数不能超过250个字符', trigger: 'blur' }
        ]
      }
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
        this.removeBathLoading = false
      }).catch(({ response }) => {
        this.removeBathLoading = false
      })
    },
    handleAdd () {
      this.addModalVisible = true
      this.model = {}
      this.fileList = []
    },
    saveData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.fileList && this.fileList.length) {
            this.model.path = this.fileList[0].path
          }
          save(this.model).then((res) => {
            this.$refs.table.refresh(true)
            saveSuccessTip()
            this.addModalVisible = false
          })
        }
      })
    },
    deploymentProcess (id) {
      deploymentProcess(id).then(res => {
        successTip()
      })
    },
    exportModel (id) {
      exportModel(id).then(res => {
        downloadFileById(res.data)
      })
    }
  }
}
</script>
