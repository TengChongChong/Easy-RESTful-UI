<template>
  <s-table
    ref="eTable"
    :columns="columns"
    :data="loadData"
    size="small"
    :showSizeChanger="false"
    showPagination="auto"
  >
  </s-table>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { select } from '@/api/scheduler/job-log'
import { formatDate } from '@/utils/util'
import { DATE_PATTERN } from '@/utils/const/datePattern'

const columns = [
  {
    title: '执行时间',
    dataIndex: 'runDate',
    sorter: true,
    width: 170,
    customRender: (text) => formatDate(text, DATE_PATTERN.NORM_DATETIME_PATTERN)
  },
  {
    title: '耗时（s）',
    dataIndex: 'timeConsuming',
    width: 200,
    sorter: true,
    customRender: (text) => text / 1000
  }
]

export default {
  name: 'SchedulerJobLogList',
  components: {
    STable,
    Ellipsis
  },
  props: {
    id: {
      type: String,
      default: null,
      required: true
    }
  },
  data () {
    this.columns = columns
    return {
      DATE_PATTERN: DATE_PATTERN
    }
  },
  watch: {
    id () {
      this.$refs.eTable.refresh()
    }
  },
  methods: {
    // 加载数据方法 必须为 Promise 对象
    loadData (parameter) {
      const requestParameters = Object.assign({}, parameter, {
        jobId: this.id
      })
      return select(requestParameters)
        .then(res => {
          return res.data
        })
    }
  }
}
</script>
