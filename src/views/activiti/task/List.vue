<template>
  <div>
    <e-pro-table title="流程跟踪" :no-advanced="true">
      <template slot="query">
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="ID">
            <a-input v-model="queryParam.processInstanceId"/>
          </a-form-model-item>
        </a-col>
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="业务">
            <a-input v-model="queryParam.businessTitle"/>
          </a-form-model-item>
        </a-col>
      </template>

      <template slot="table">
        <s-table
          ref="eTable"
          row-key="processInstanceId"
          :columns="columns"
          :data="loadData"
          showPagination="auto"
        >
          <span slot="action" slot-scope="text, record">
            <template>
              <e-btn-work-flow-progress :execution-id="record.executionId" :process-instance-id="record.processInstanceId"/>
              <a-tooltip v-if="'waitingClaim' === status" placement="top">
                <template slot="title">
                  <span>签收</span>
                </template>
                <a-button type="primary" size="small" icon="check" @click="claimTask(record.id)"/>
              </a-tooltip>
              <a-tooltip v-else placement="top">
                <template slot="title">
                  <span>办理</span>
                </template>
                <a-button type="primary" size="small" icon="form" @click="handleTask(record)"/>
              </a-tooltip>
            </template>
          </span>
        </s-table>
      </template>
    </e-pro-table>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, claimTask } from '@/api/activiti/task'
import EDictTag from '@/components/Easy/data-display/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EProTable from '@/components/Easy/data-display/ProTable'
import { SUSPENSION_STATUS } from '@/utils/const/activiti/SuspensionStatus'
import { formatDate, openView } from '@/utils/util'
import { TASK_STATUS } from '@/utils/const/activiti/TaskStatus'
import EBtnWorkFlowProgress from '@/components/Easy/general/work-flow/BtnProgress'
import EBtnWorkFlowRevoke from '@/components/Easy/general/work-flow/BtnRevoke'
import { successTip } from '@/utils/tips'

const columns = [
  {
    title: 'ID',
    dataIndex: 'processInstanceId',
    sortField: 'art.proc_inst_id_',
    width: 100,
    sorter: true
  },
  {
    title: '业务',
    dataIndex: 'businessTitle',
    sortField: 'arv_businessTitle.text_',
    width: 180,
    sorter: true
  },
  {
    title: '所属流程',
    dataIndex: 'processDefinitionName',
    sortField: 'arp.name_',
    width: 100,
    sorter: true
  },
  {
    title: '当前步骤',
    dataIndex: 'name',
    sortField: 'art.name_',
    sorter: true,
    width: 120
  },
  {
    title: '发起人',
    dataIndex: 'applyUser',
    width: 100,
    sorter: true,
    sortField: 'arv_applyUserId.text_'
  },
  {
    title: '发起时间',
    dataIndex: 'createTime',
    width: 170,
    sorter: true,
    sortField: 'art.create_time_',
    customRender: (text) => formatDate(text)
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 120,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'ActivitiTaskList',
  components: {
    EBtnWorkFlowRevoke,
    EBtnWorkFlowProgress,
    EProTable,
    EDictSelect,
    EDictTag,
    STable,
    Ellipsis
  },
  props: {
    status: {
      type: String,
      default: null
    }
  },
  data () {
    this.columns = columns
    return {
      SUSPENSION_STATUS: SUSPENSION_STATUS,
      TASK_STATUS: TASK_STATUS,
      // 查询参数
      queryParam: {}
    }
  },
  activated () {
    this.$refs.eTable.refresh(true)
  },
  methods: {
    // 加载数据方法 必须为 Promise 对象
    loadData (parameter) {
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      return select(this.status, requestParameters)
        .then(res => {
          return res.data
        })
    },
    claimTask (processInstanceId) {
      claimTask(processInstanceId).then(res => {
        successTip('签收成功')
        this.$refs.eTable.refresh(true)
      })
    },
    handleTask (record) {
      openView(this.$router, `/activiti/task/input/${record.id}`, record.processDefinitionName)
    }
  }
}
</script>
