<template>
  <span>
    <a-tooltip placement="top">
      <template slot="title">
        <span>{{ name }}</span>
      </template>
      <a-button :loading="loading" size="small" :icon="icon" @click="progress"/>
    </a-tooltip>
    <a-divider v-if="divider" type="vertical"/>
    <!--  审核进度  -->
    <a-modal :width="800" v-model="progressModalVisible" title="审核进度">
      <template slot="footer">
        <a-button @click="() => {this.progressModalVisible = false}">关闭</a-button>
      </template>
      <img
        class="flow-chart"
        :src="imageUrl">
      <a-divider>活动记录</a-divider>
      <timeline>
        <timeline-item v-for="item in historic" :key="item.id">
          <a-icon v-if="item.activityType === 'startEvent'" slot="dot" type="play-circle"/>
          <a-icon v-if="item.activityType === 'userTask'" slot="dot" type="user"/>
          <a-icon v-if="item.activityType === 'endEvent'" slot="dot" type="check-circle"/>
          {{ item.activityName }}
          {{ item.assignee ? `[${item.assignee}]` : item.activityType === 'userTask' ? '未签收' : '' }}
          <a-tag color="blue">
            {{ fromNow(item.startTime) }}
          </a-tag>
        </timeline-item>
      </timeline>
      <a-table
        bordered
        :columns="columns"
        row-key="variableName"
        :data-source="variable"
        size="small"
        :pagination="false"/>
    </a-modal>

  </span>
</template>
<script>
import { Timeline } from 'ant-design-vue'
import { selectHistoric, selectTask } from '@/api/activiti/historic'
import { fromNow, isNotBlank } from '@/utils/util'
import { selectVariable } from '@/api/activiti/variable'
import PropTypes from 'ant-design-vue/es/_util/vue-types'

const TimelineItem = Timeline.Item
export default {
  name: 'EBtnWorkFlowProgress',
  components: {
    Timeline,
    TimelineItem
  },
  props: {
    name: PropTypes.string.def('查询进度'),
    icon: PropTypes.string.def('deployment-unit'),
    divider: PropTypes.bool.def(true),
    // 执行实例ID
    executionId: PropTypes.string.def(),
    // 流程实例ID
    processInstanceId: PropTypes.string.def(),
    businessKey: PropTypes.string.def()
  },
  data () {
    return {
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
      loading: false,
      // -- 查看流程图
      progressModalVisible: false,
      imageUrl: null,
      historic: [],
      variable: [],
      columns: [
        {
          title: '流程变量',
          children: [
            {
              dataIndex: 'variableName',
              title: 'variableName',
              width: 200
            },
            {
              dataIndex: 'value',
              title: 'value'
            }
          ]
        }
      ]
    }
  },
  watch: {},
  methods: {
    /**
     * 根据业务数据id打开流程跟踪模态框
     *
     * @param businessKey {string} 业务数据id
     */
    progress () {
      this.loading = true
      if (isNotBlank(this.businessKey)) {
        selectTask(this.businessKey).then(res => {
          this.processProgress(res.data.executionId, res.data.processInstanceId)
        }).catch(res => {
          this.loading = false
        })
      } else {
        if (isNotBlank(this.executionId) && isNotBlank(this.processInstanceId)) {
          this.processProgress(this.executionId, this.processInstanceId)
        }
      }
    },
    /**
     * 查看审核进度
     *
     * @param executionId {string} 执行实例ID
     * @param processInstanceId {string} 流程实例ID
     */
    processProgress (executionId, processInstanceId) {
      this.loading = false
      this.progressModalVisible = true
      this.selectHistoric(processInstanceId)
      this.selectVariable(processInstanceId)
      this.imageUrl = `${this.VUE_APP_API_BASE_URL}/activiti/process/trace/process/progress/image/${executionId}?t=${new Date().getTime()}`
    },
    /**
     * 查询活动记录
     */
    selectHistoric (processInstanceId) {
      selectHistoric(processInstanceId).then(res => {
        this.historic = res.data
        for (const [i, item] of this.historic.entries()) {
          if (item.activityType === 'exclusiveGateway') {
            this.historic.splice(i, 1)
          }
        }
      })
    },
    /**
     * 查询流程相关变量
     */
    selectVariable (processInstanceId) {
      selectVariable(processInstanceId).then(res => {
        this.variable = res.data
      })
    },
    fromNow (date) {
      return fromNow(date)
    }
  }
}
</script>
<style>
.ant-timeline-item-last > .ant-timeline-item-content {
  min-height: auto;
}
</style>
