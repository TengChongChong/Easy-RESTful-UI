<template>
  <a-form-model
    :model="model"
    :label-col="FORM_LAYOUT.labelCol"
    :wrapper-col="FORM_LAYOUT.wrapperCol">
    <a-row class="form-row" :gutter="16">
      <a-col :sm="24">
        <a-form-model-item label="备注" :labelCol="{ span: 3 }" :wrapperCol="{ span: 19 }">
          [
          <e-dict-tag type="leaveType" :code="model.leaveType"/>
          ] {{ model.reason }}
        </a-form-model-item>
      </a-col>
      <a-col :sm="24">
        <a-form-model-item label="时间" :labelCol="{ span: 3 }" :wrapperCol="{ span: 19 }">
          {{ model.startDate | moment(DATE_PATTERN.NORM_DATETIME_MINUTE_PATTERN) }} ~
          {{ model.endDate | moment(DATE_PATTERN.NORM_DATETIME_MINUTE_PATTERN) }}
        </a-form-model-item>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script>
import { FORM_LAYOUT } from '@/utils/const/form'
import { get } from '@/api/sample/work-flow'
import { isNotBlank } from '@/utils/util'
import EDictTag from '@/components/Easy/data-display/DictTag'
import { DATE_PATTERN } from '@/utils/const/datePattern'

export default {
  name: 'SampleWorkFlowInfo',
  components: { EDictTag },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      dateFormat: 'YYYY-MM-DD HH:mm',
      rangePickerValue: [],
      FORM_LAYOUT: FORM_LAYOUT,
      DATE_PATTERN: DATE_PATTERN,
      model: {}
    }
  },
  created () {
    if (isNotBlank(this.id)) {
      this.edit(this.id)
    }
  },
  watch: {
    id (newVal) {
      this.id = newVal
      if (isNotBlank(this.id)) {
        this.edit(this.id)
      }
    }
  },
  methods: {
    edit (id) {
      get(id).then((res) => {
        this.model = res.data
      })
    }
  }
}
</script>
