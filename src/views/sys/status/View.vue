<template>
  <div>
    <a-card title="内存" :bordered="false" style="margin-bottom: 24px">
      <a-row type="flex">
        <a-col flex="320px">
          <a-descriptions :column="1" bordered>
            <a-descriptions-item label="Max Memory">
              {{ (runtimeInfo.maxMemory / 1024 / 1024).toFixed(2) }} MB
            </a-descriptions-item>
            <a-descriptions-item label="Total Memory">
              {{ (runtimeInfo.totalMemory / 1024 / 1024).toFixed(2) }} MB
            </a-descriptions-item>
            <a-descriptions-item label="Free Memory">
              {{ (runtimeInfo.freeMemory / 1024 / 1024).toFixed(2) }} MB
            </a-descriptions-item>
            <a-descriptions-item label="Usable Memory">
              <span :style="{color: color}"> {{ (runtimeInfo.usableMemory / 1024 / 1024).toFixed(2) }} </span> MB
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
        <a-col flex="auto">
          <v-chart ref="memoryChart" class="memory-chart" :options="options"/>
        </a-col>
      </a-row>
    </a-card>
    <a-card title="JAVA" :bordered="false" style="margin-bottom: 24px">
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="Java Virtual Machine Specification">
          {{ jvmSpecInfo.name }} {{ jvmSpecInfo.version }} {{ jvmSpecInfo.vendor }}
        </a-descriptions-item>

        <a-descriptions-item label="Java Virtual Machine Implementation">
          {{ jvmInfo.name }} {{ jvmInfo.version }} {{ jvmInfo.vendor }} {{ jvmInfo.info }}
        </a-descriptions-item>

        <a-descriptions-item label="Java Specification">
          {{ javaSpecInfo.name }} {{ javaSpecInfo.version }} {{ javaSpecInfo.vendor }}
        </a-descriptions-item>

        <a-descriptions-item label="Java Implementation">
          <a target="_blank" :href="javaInfo.vendorURL">{{ javaInfo.vendor }} {{ javaInfo.version }}</a>
        </a-descriptions-item>

        <a-descriptions-item label="Java Runtime" :span="2">
          Java Runtime Name: {{ javaRuntimeInfo.name }} <br/>
          Java Runtime Version: {{ javaRuntimeInfo.version }} <br/>
          Java Home Dir: {{ javaRuntimeInfo.homeDir }} <br/>
          Java Endorsed Dirs: {{ javaRuntimeInfo.endorsedDirs }} <br/>
          Java Class Version: {{ javaRuntimeInfo.classVersion }} <br/>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card title="系统信息" :bordered="false">
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="OS">
          {{ osInfo.name }} {{ osInfo.arch }} {{ osInfo.version }}
        </a-descriptions-item>
        <a-descriptions-item label="User Name">
          {{ userInfo.name }}
        </a-descriptions-item>
        <a-descriptions-item label="User Current Dir">
          {{ userInfo.currentDir }}
        </a-descriptions-item>
        <a-descriptions-item label="Host Address">
          {{ hostInfo.address }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/coord/cartesian/Grid'

import {
  getHostInfo,
  getJavaInfo,
  getJavaRuntimeInfo,
  getJavaSpecInfo,
  getJvmInfo,
  getJvmSpecInfo,
  getOsInfo, getRuntimeInfo, getUserInfo
} from '@/api/sys/status'
import { DATE_PATTERN } from '@/utils/const/datePattern'
import { formatDate } from '@/utils/util'

export default {
  name: 'SysStatusView',
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
      jvmSpecInfo: {},
      jvmInfo: {},
      javaSpecInfo: {},
      javaInfo: {},
      javaRuntimeInfo: {},
      osInfo: {},
      userInfo: {},
      hostInfo: {},
      runtimeInfo: {},

      proportion: 0,
      color: 'green',

      options: {
        grid: {
          top: '20px',
          right: '30px',
          left: '40px',
          bottom: '70px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '已使用 : {c} %'
        },
        xAxis: {
          type: 'category',
          data: [],
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          axisLabel: {
            formatter: '{value} %'
          }
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 20
        }, {
          start: 0,
          end: 20
        }],
        series: [{
          name: '已使用',
          data: [],
          type: 'line'
        }]
      }
    }
  },
  created () {
    this.getJvmSpecInfo()
    this.getJvmInfo()
    this.getJavaSpecInfo()
    this.getJavaInfo()
    this.getJavaRuntimeInfo()
    this.getOsInfo()
    this.getUserInfo()
    this.getHostInfo()
    this.getRuntimeInfo()

    setInterval(() => {
      this.getRuntimeInfo()
    }, 1000 * 10)
  },
  methods: {
    getJvmSpecInfo () {
      getJvmSpecInfo().then(({ data }) => {
        this.jvmSpecInfo = data
      })
    },
    getJvmInfo () {
      getJvmInfo().then(({ data }) => {
        this.jvmInfo = data
      })
    },
    getJavaSpecInfo () {
      getJavaSpecInfo().then(({ data }) => {
        this.javaSpecInfo = data
      })
    },
    getJavaInfo () {
      getJavaInfo().then(({ data }) => {
        this.javaInfo = data
      })
    },
    getJavaRuntimeInfo () {
      getJavaRuntimeInfo().then(({ data }) => {
        this.javaRuntimeInfo = data
      })
    },
    getOsInfo () {
      getOsInfo().then(({ data }) => {
        this.osInfo = data
      })
    },
    getUserInfo () {
      getUserInfo().then(({ data }) => {
        this.userInfo = data
      })
    },
    getHostInfo () {
      getHostInfo().then(({ data }) => {
        this.hostInfo = data
      })
    },
    getRuntimeInfo () {
      this.options.xAxis.data.push(formatDate(new Date(), DATE_PATTERN.NORM_TIME_PATTERN))
      getRuntimeInfo().then(({ data }) => {
        this.runtimeInfo = data
        this.proportion = Math.round((this.runtimeInfo.maxMemory - this.runtimeInfo.usableMemory) / this.runtimeInfo.maxMemory * 100)
        this.options.series[0].data.push(this.proportion)
        if (this.proportion <= 45) {
          this.color = '#a0d911'
        } else if (this.proportion <= 55) {
          this.color = '#fadb14'
        } else if (this.proportion <= 70) {
          this.color = '#fa8c16'
        } else if (this.proportion <= 85) {
          this.color = '#f5222d'
        }
      })
    }
  }
}
</script>

<style>
.memory-chart {
  width: 100%;
  height: 220px;
}
</style>
