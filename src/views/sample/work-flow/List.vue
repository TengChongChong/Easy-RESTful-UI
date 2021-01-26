<template>
  <div>
    <e-pro-table title="请假" :no-advanced="true">
      <template slot="query">
        <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
          <a-form-model-item label="类型">
            <e-dict-select type="leaveType" v-model="queryParam.leaveType" @change="$refs.eTable.refresh(true)"/>
          </a-form-model-item>
        </a-col>
      </template>

      <template slot="button">
        <e-btn-add to="/sample/work-flow/input"/>
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
          <span slot="leaveType" slot-scope="text">
            <e-dict-tag type="leaveType" :code="text"/>
          </span>
          <span slot="workFlowStatus" slot-scope="text">
            <e-dict-tag type="taskStatus" :code="text"/>
          </span>

          <span slot="action" slot-scope="text, record">
            <template>
              <template v-if="record.processInstanceId == null">
                <e-btn-work-flow-start
                  model-key="leave"
                  :business-key="record.id"
                  :business-title="getBusinessTitle(record)"
                  business-details-path="views/sample/work-flow/Info"/>
                <e-btn-edit :to="`/sample/work-flow/input`" :tab-name="record.key" :id="record.id"/>
                <e-btn-remove :id="record.id" :divider="false" :click-callback="remove"/>
              </template>
              <e-btn-work-flow-progress v-if="record.processInstanceId != null" :business-key="record.id"/>
              <e-btn-work-flow-revoke
                v-if="record.processInstanceId != null && record.workFlowStatus !== '已办结' && record.workFlowStatus !== '已撤销'"
                :business-key="record.id"
                :divider="false"
                :reason="true"/>
            </template>
          </span>
        </s-table>
      </template>
    </e-pro-table>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select, remove } from '@/api/sample/work-flow'
import EDictTag from '@/components/Easy/data-display/DictTag'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import EBtnAdd from '@/components/Easy/general/BtnAdd'
import EBtnEdit from '@/components/Easy/general/BtnEdit'
import EBtnRemove from '@/components/Easy/general/BtnRemove'
import EBtnRemoveBatch from '@/components/Easy/general/BtnRemoveBatch'
import EProTable from '@/components/Easy/data-display/ProTable'
import { formatDate, getSysDictNameByQuery } from '@/utils/util'
import EBtnWorkFlowStart from '@/components/Easy/general/work-flow/BtnStart'
import EBtnWorkFlowProgress from '@/components/Easy/general/work-flow/BtnProgress'
import EBtnWorkFlowRevoke from '@/components/Easy/general/work-flow/BtnRevoke'

const columns = [
  {
    title: '流程实例id',
    dataIndex: 'processInstanceId',
    width: 120,
    sorter: true,
    customRender: (text) => text || '-'
  },
  {
    title: '请假类型',
    dataIndex: 'leaveType',
    width: 100,
    sorter: true,
    scopedSlots: { customRender: 'leaveType' }
  },
  {
    title: '原因',
    dataIndex: 'reason',
    width: 200,
    sorter: true
  },
  {
    title: '开始时间',
    dataIndex: 'startDate',
    sorter: true,
    width: 170,
    customRender: (text) => formatDate(text)
  },
  {
    title: '结束时间',
    dataIndex: 'endDate',
    sorter: true,
    width: 170,
    customRender: (text) => formatDate(text)
  },
  {
    title: '状态',
    dataIndex: 'workFlowStatus',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 140,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SampleWorkFlowList',
  components: {
    EBtnWorkFlowRevoke,
    EBtnWorkFlowProgress,
    EBtnWorkFlowStart,
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
    start (record) {
      this.$refs.workFlow.start(
        'leave',
        record.id,
        `[${getSysDictNameByQuery('leaveType', record.leaveType)}]${record.reason}`,
        `/sample/work-flow/Info?id=${record.id}`,
        null
      )
    },
    getBusinessTitle (record) {
      return `[${getSysDictNameByQuery('leaveType', record.leaveType)}]${record.reason}`
    }
  }
}
</script>
