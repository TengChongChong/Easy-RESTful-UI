<template>
  <a-row :gutter="16">
    <a-col :xl="12">
      <a-card :bordered="false">
        <v-chart :options="option1"/>
      </a-card>
    </a-col>
    <a-col :xl="12">
      <a-card :bordered="false">
        <v-chart :options="option2"/>
      </a-card>
    </a-col>
    <a-col :xs="24">
      <a-card :bordered="false">
        使用 <a target="_blank" href="https://github.com/ecomfe/vue-echarts/blob/master/README.zh_CN.md">Vue-ECharts</a>
        和 <a target="_blank" href="https://echarts.apache.org/zh/index.html">ECharts</a>，具体使用方法请查看文档
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

const labelRight = {
  position: 'right'
}

export default {
  name: 'SampleChartsBar',
  data () {
    return {
      option1: {
        title: {
          text: '访问量统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      },
      option2: {
        title: {
          text: '交错正负轴标签',
          subtext: 'From ExcelHome',
          sublink: 'http://e.weibo.com/1341556070/AjwF2AgQm'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 80,
          bottom: 30
        },
        xAxis: {
          type: 'value',
          position: 'top',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'category',
          axisLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          data: ['ten', 'nine', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one']
        },
        series: [
          {
            name: '生活费',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              formatter: '{b}'
            },
            data: [
              { value: -0.07, label: labelRight },
              { value: -0.09, label: labelRight },
              0.2, 0.44,
              { value: -0.23, label: labelRight },
              0.08,
              { value: -0.17, label: labelRight },
              0.47,
              { value: -0.36, label: labelRight },
              0.18
            ]
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
.echarts {
  width: 100%;
  margin: 0 auto;
}
</style>
