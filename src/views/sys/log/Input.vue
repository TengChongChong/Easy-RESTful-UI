<template>
  <a-card title="访问日志" :bordered="false">
    <a-form-model
      ref="form"
      :model="model"
      :label-col="FORM_LAYOUT.labelCol"
      :wrapper-col="FORM_LAYOUT.wrapperCol">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="模块">
            {{ model.modular }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="方法">
            {{ model.method }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="url">
            {{ model.url }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="uri">
            {{ model.uri }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="操作人">
            {{ model.operationUser }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="操作时间">
            {{ model.operationDate }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="ip">
            {{ model.ip }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="class">
            {{ model.clazz }}.{{ model.methodName }}()
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <a-form-model-item label="参数" :labelCol="FULL_FORM_LAYOUT.labelCol" :wrapperCol="FULL_FORM_LAYOUT.wrapperCol">
            {{ model.params }}
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
import { FORM_LAYOUT, FULL_FORM_LAYOUT } from '@/utils/const/form'
import { get } from '@/api/sys/log'

export default {
  name: 'SysLogInput',
  data () {
    return {
      id: this.$route.query.id,

      // 表单
      FORM_LAYOUT: FORM_LAYOUT,
      FULL_FORM_LAYOUT: FULL_FORM_LAYOUT,
      model: {}
    }
  },
  created () {
    get(this.id).then((res) => {
      this.model = res.data
    })
  }
}
</script>
