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
          <span slot="taskStatus" slot-scope="text, record">
            <e-dict-tag
              v-if="record.deleteReason != null && record.deleteReason !== ''"
              type="taskStatus"
              :code="TASK_STATUS.RESCINDED"/>
            <e-dict-tag v-else-if="record.endTime == null" type="taskStatus" :code="TASK_STATUS.IN_PROCESS"/>
            <e-dict-tag v-else type="taskStatus" :code="TASK_STATUS.COMPLETED"/>
          </span>
          <span slot="processSuspensionState" slot-scope="text">
            <e-dict-tag type="suspensionState" :code="text"/>
          </span>
          <span slot="action" slot-scope="text, record">
            <template>
              <e-btn-work-flow-progress :divider="record.deleteReason == null || record.endTime == null" :execution-id="record.executionId" :process-instance-id="record.processInstanceId"/>
              <e-btn-work-flow-revoke v-if="record.deleteReason == null || record.endTime == null" :reason="true" :divider="false" :process-instance-id="record.processInstanceId"/>
            </template>
          </span>
        </s-table>
      </template>
    </e-pro-table>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { selectAll } from '@/api/activiti/historyTaskInstance'
import EDictTag from '@/components/Easy/data-entry/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EProTable from '@/components/Easy/data-display/ProTable'
import { SUSPENSION_STATUS } from '@/utils/const/activiti/SuspensionStatus'
import { formatDate } from '@/utils/util'
import { TASK_STATUS } from '@/utils/const/activiti/TaskStatus'
import EBtnWorkFlowProgress from '@/components/Easy/general/work-flow/BtnProgress'
import EBtnWorkFlowRevoke from '@/components/Easy/general/work-flow/BtnRevoke'

const columns = [
  {
    title: 'ID',
    dataIndex: 'processInstanceId',
    sortField: 't.process_instance_id',
    width: 100,
    sorter: true
  },
  {
    title: '业务',
    dataIndex: 'businessTitle',
    sortField: 't.business_title',
    width: 180,
    sorter: true
  },
  {
    title: '所属流程',
    dataIndex: 'processDefinitionName',
    sortField: 't.process_definition_name',
    width: 100,
    sorter: true
  },
  {
    title: '当前步骤',
    dataIndex: 'name',
    sortField: 't.name',
    sorter: true,
    width: 120
  },
  {
    title: '任务状态',
    dataIndex: 'taskStatus',
    width: 100,
    scopedSlots: { customRender: 'taskStatus' }
  },
  {
    title: '撤销原因',
    dataIndex: 'deleteReason',
    width: 200,
    sorter: true,
    sortField: 't.delete_reason_'
  },
  {
    title: '流程状态',
    dataIndex: 'processSuspensionState',
    sortField: 't.process_suspension_state',
    sorter: true,
    width: 100,
    scopedSlots: { customRender: 'processSuspensionState' }
  },
  {
    title: '发起时间',
    dataIndex: 'startTime',
    width: 170,
    sorter: true,
    sortField: 't.start_time_',
    customRender: (text) => formatDate(text)
  },
  {
    title: '发起人',
    dataIndex: 'applyUser',
    width: 100,
    sorter: true,
    sortField: 't.nickname'
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
  name: 'ActivitiHistoryTaskInstanceAll',
  components: {
    EBtnWorkFlowRevoke,
    EBtnWorkFlowProgress,
    EProTable,
    EDictSelect,
    EDictTag,
    STable,
    Ellipsis
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
      return selectAll(requestParameters)
        .then(res => {
          return res.data
        })
    }
  }
}
</script>
