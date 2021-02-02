<template>
  <div>
    <e-pro-table title="流程" :no-advanced="true">
      <template slot="query">
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="ID">
            <a-input v-model="queryParam.processDefinitionId"/>
          </a-form-model-item>
        </a-col>
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="名称">
            <a-input v-model="queryParam.name"/>
          </a-form-model-item>
        </a-col>
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="状态">
            <e-dict-select type="suspensionState" v-model="queryParam.suspensionState" @change="$refs.eTable.refresh(true)"/>
          </a-form-model-item>
        </a-col>

      </template>

      <template slot="button">
        <e-btn-remove-batch :permissions="ACTIVITI_PERMISSIONS_CODE.PROCESS_REMOVE" :loading="removeBathLoading" :ids="selectedRowKeys" :click-callback="remove"/>
      </template>

      <template slot="table">
        <s-table
          ref="eTable"
          row-key="deploymentId"
          :columns="columns"
          :data="loadData"
          :alert="true"
          :rowSelection="rowSelection"
          showPagination="auto"
        >
          <span slot="version" slot-scope="text">
            <a-tag color="blue">v.{{ text }}</a-tag>
          </span>
          <span slot="suspensionState" slot-scope="text">
            <e-dict-tag type="suspensionState" :code="text"/>
          </span>
          <span slot="action" slot-scope="text, record">
            <template>
              <e-btn-remove :id="record.deploymentId" :click-callback="remove"/>
              <template v-if="$permissions(ACTIVITI_PERMISSIONS_CODE.PROCESS_SUSPEND) && SUSPENSION_STATUS.ACTIVATION === record.suspensionState">
                <a-popconfirm
                  title="挂起流程将同时挂起流程相关的任务"
                  @confirm="() => suspend(record.processDefinitionId)"
                >
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>挂起</span>
                    </template>
                    <a-button size="small" icon="pause-circle"/>
                  </a-tooltip>
                </a-popconfirm>
                <a-divider type="vertical" />
              </template>
              <template v-if="$permissions(ACTIVITI_PERMISSIONS_CODE.PROCESS_ACTIVATION) && SUSPENSION_STATUS.SUSPENSION === record.suspensionState">
                <a-popconfirm
                  title="激活流程将同时激活流程相关的任务"
                  @confirm="() => activation(record.processDefinitionId)"
                >
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>激活</span>
                    </template>
                    <a-button type="primary" size="small" icon="check"/>
                  </a-tooltip>
                </a-popconfirm>
                <a-divider type="vertical" />
              </template>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>查看流程图</span>
                </template>
                <a-button size="small" icon="deployment-unit" @click="showModelModal(record.deploymentId, record.dgrmResourceName)"/>
              </a-tooltip>
              <a-divider type="vertical" />
              <a-tooltip placement="top" v-if="$permissions(ACTIVITI_PERMISSIONS_CODE.MODEL_SAVE)">
                <template slot="title">
                  <span>转为模型</span>
                </template>
                <a-button type="primary" size="small" icon="swap" @click="handleAdd(record.processDefinitionId)"/>
              </a-tooltip>
            </template>
          </span>
        </s-table>
      </template>
    </e-pro-table>
    <a-modal v-model="addModalVisible" :confirmLoading="confirmLoading" title="转为模型" @ok="save" okText="确定">
      <a-form-model
        ref="form"
        :model="model"
        :rules="rules"
        :label-col="FORM_LAYOUT.labelCol"
        :wrapper-col="FORM_LAYOUT.wrapperCol">
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="model.name"/>
        </a-form-model-item>
        <a-form-model-item label="标识" prop="key">
          <a-input v-model="model.key"/>
        </a-form-model-item>
        <a-form-model-item label="描述" prop="description">
          <a-textarea v-model="model.description"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal :width="800" v-model="modalVisible" title="流程图">
      <template slot="footer">
        <a-button @click="() => {this.modalVisible = false}">关闭</a-button>
      </template>
      <img class="flow-chart" :src="`${VUE_APP_API_BASE_URL}/activiti/process/${deploymentId}/${resourceName}/image/stream`">
    </a-modal>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, remove, suspend, activation, convertToModel } from '@/api/activiti/process'
import EDictTag from '@/components/Easy/data-display/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EBtnAdd from '@/components/Easy/general/BtnAdd'
import EBtnEdit from '@/components/Easy/general/BtnEdit'
import EBtnRemove from '@/components/Easy/general/BtnRemove'
import EBtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import EProTable from '@/components/Easy/data-display/ProTable'
import { FORM_LAYOUT } from '@/utils/const/form'
import { successTip } from '@/utils/tips'
import { SUSPENSION_STATUS } from '@/utils/const/activiti/SuspensionStatus'
import { formatDate } from '@/utils/util'
import { ACTIVITI_PERMISSIONS_CODE } from '@/utils/const/activiti/PermissionsCode'

const columns = [
  {
    title: 'ID',
    dataIndex: 'processDefinitionId',
    sortField: 'arp.id_',
    width: 180,
    sorter: true
  },
  {
    title: '名称',
    dataIndex: 'name',
    sortField: 'arp.name_',
    width: 180,
    sorter: true
  },
  {
    title: '标识',
    dataIndex: 'key',
    sortField: 'arp.key_',
    width: 180,
    sorter: true
  },
  {
    title: '版本号',
    dataIndex: 'version',
    sortField: 'arp.version_',
    sorter: true,
    width: 80,
    scopedSlots: { customRender: 'version' }
  },
  {
    title: '部署时间',
    dataIndex: 'deployTime',
    sortField: 'ard.deploy_time_',
    width: 170,
    sorter: true,
    customRender: (text) => formatDate(text)
  },
  {
    title: '状态',
    dataIndex: 'suspensionState',
    sortField: 'arp.suspension_state_',
    sorter: true,
    width: 80,
    scopedSlots: { customRender: 'suspensionState' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 170,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'ActivitiProcessList',
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
      ACTIVITI_PERMISSIONS_CODE: ACTIVITI_PERMISSIONS_CODE,

      SUSPENSION_STATUS: SUSPENSION_STATUS,

      // 查询参数
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      removeBathLoading: false,

      // 新增窗口
      addModalVisible: false,
      confirmLoading: false,
      FORM_LAYOUT: FORM_LAYOUT,
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
      },

      // 查看流程图
      modalVisible: false,
      deploymentId: null,
      resourceName: null,
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL
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
    handleAdd (processDefinitionId) {
      this.addModalVisible = true
      this.model = {
        processDefinitionId: processDefinitionId
      }
    },
    save () {
      this.$refs.form.validate(valid => {
        this.confirmLoading = true
        convertToModel(this.model).then(res => {
          successTip()
          this.addModalVisible = false
          this.confirmLoading = false
        }).catch(({ response }) => {
          this.confirmLoading = false
        })
      })
    },
    /**
     * 挂起流程
     *
     * @param processDefinitionId     流程id
     * @param suspendProcessInstances 如果为true，将同时挂起此流程正在进行的任务
     */
    suspend (processDefinitionId, suspendProcessInstances = true) {
      suspend(processDefinitionId, suspendProcessInstances).then(res => {
        successTip()
        this.$refs.eTable.refresh(true)
      })
    },
    /**
     * 激活流程
     *
     * @param processDefinitionId     流程id
     * @param suspendProcessInstances 如果为true，将同时激活此流程正在进行的任务
     */
    activation (processDefinitionId, suspendProcessInstances = true) {
      activation(processDefinitionId, suspendProcessInstances).then(res => {
        successTip()
        this.$refs.eTable.refresh(true)
      })
    },
    /**
     * 查看流程图
     *
     * @param deploymentId deploymentId
     * @param resourceName resourceName
     */
    showModelModal (deploymentId, resourceName) {
      this.deploymentId = deploymentId
      this.resourceName = resourceName
      this.modalVisible = true
    }
  }
}
</script>
<style>
.flow-chart{
  width: 100%;
  height: auto;
}
</style>
