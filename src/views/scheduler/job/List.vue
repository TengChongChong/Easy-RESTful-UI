<template>
  <div>
    <e-pro-table title="定时任务" :no-advanced="true">
      <template slot="query">
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="名称">
            <a-input v-model="queryParam.name"/>
          </a-form-model-item>
        </a-col>
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="代码">
            <a-input v-model="queryParam.code"/>
          </a-form-model-item>
        </a-col>
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="状态">
            <e-dict-select type="schedulerJobStatus" v-model="queryParam.status" @change="$refs.eTable.refresh(true)"/>
          </a-form-model-item>
        </a-col>
      </template>

      <template slot="button">
        <e-btn-add to="/scheduler/job/input"/>
        <e-btn-remove-batch :loading="removeBathLoading" :ids="selectedRowKeys" :click-callback="remove"/>
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
          <span slot="status" slot-scope="text, record, index">
            <a-switch
              size="small"
              :data-id="record.id"
              :data-index="index"
              :loading="switchLoading[index]"
              :default-checked="text === SCHEDULER_STATUS_CONST.ENABLE"
              @change="statusChange"/>
          </span>

          <span slot="action" slot-scope="text, record">
            <template>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>立即执行</span>
                </template>
                <a-button type="primary" size="small" icon="play-circle" @click="immediateExecution(record.id)"/>
              </a-tooltip>
              <a-divider type="vertical"/>
              <e-btn-edit :to="`/scheduler/job/input`" :tab-name="record.key" :id="record.id"/>
              <e-btn-remove :id="record.id" :click-callback="remove"/>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>查看日志</span>
                </template>
                <a-button size="small" icon="profile" @click="showLog(record.id)"/>
              </a-tooltip>
            </template>
          </span>
        </s-table>
      </template>
    </e-pro-table>

    <a-modal v-model="logModalVisible" title="定时任务执行日志">
      <template slot="footer">
        <a-button @click="() => {this.logModalVisible = false}">关闭</a-button>
      </template>
      <scheduler-job-log-list :id="jobId"/>
    </a-modal>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, remove, start, pause, immediateExecution } from '@/api/scheduler/job'
import EDictTag from '@/components/Easy/data-display/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EBtnAdd from '@/components/Easy/general/BtnAdd'
import EBtnEdit from '@/components/Easy/general/BtnEdit'
import EBtnRemove from '@/components/Easy/general/BtnRemove'
import EBtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import EProTable from '@/components/Easy/data-display/ProTable'
import { formatDate } from '@/utils/util'
import { SCHEDULER_STATUS_CONST } from '@/utils/const/scheduler/SchedulerStatusConst'
import { successTip } from '@/utils/tips'
import SchedulerJobLogList from '@/views/scheduler/job-log/List'

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 200,
    sorter: true
  },
  {
    title: '代码',
    dataIndex: 'code',
    width: 140,
    sorter: true
  },
  {
    title: 'cron',
    dataIndex: 'cron',
    width: 140,
    sorter: true
  },
  {
    title: '类',
    dataIndex: 'bean',
    width: 140,
    sorter: true
  },
  {
    title: '方法',
    dataIndex: 'method',
    width: 140,
    sorter: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 100,
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '上次执行时间',
    dataIndex: 'lastRunDate',
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
  name: 'SchedulerJobList',
  components: {
    SchedulerJobLogList,
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
      SCHEDULER_STATUS_CONST: SCHEDULER_STATUS_CONST,
      // 查询参数
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      switchLoading: [],
      removeBathLoading: false,

      // 查看日志
      logModalVisible: false,
      jobId: null
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
          let dataLength = res.data.data.length
          while (dataLength--) {
            this.switchLoading[dataLength] = false
          }
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
    statusChange (checked, event) {
      const index = Number(event.target.dataset.index)
      this.switchLoading.splice(index, 1, true)
      if (checked) {
        start(event.target.dataset.id).then(res => {
          this.switchLoading.splice(index, 1, false)
        })
      } else {
        pause(event.target.dataset.id).then(res => {
          this.switchLoading.splice(index, 1, false)
        })
      }
    },
    /**
     * 立即执行指定任务
     *
     * @param id 数据id
     * @return true/false
     */
    immediateExecution (id) {
      immediateExecution(id).then(res => {
        successTip()
      })
    },
    showLog (id) {
      this.jobId = id
      this.logModalVisible = true
    }
  }
}
</script>
