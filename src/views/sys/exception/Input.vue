<template>
  <a-card title="系统参数" :bordered="false">
    <a-form-model
      ref="form"
      :model="model"
      :label-col="FORM_LAYOUT.labelCol"
      :wrapper-col="FORM_LAYOUT.wrapperCol">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="错误代码">
            {{ model.code }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="异常类型">
            {{ model.type }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="触发用户">
            {{ model.nickname }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="触发时间">
            {{ model.triggerTime | moment }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="请求地址">
            {{ model.url }}
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <a-form-model-item
            label="异常信息"
            :labelCol="FULL_FORM_LAYOUT.labelCol"
            :wrapperCol="FULL_FORM_LAYOUT.wrapperCol">
            <div class="scrollbar">
              {{ model.message }}
            </div>
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <a-form-model-item
            label="异常信息"
            :labelCol="FULL_FORM_LAYOUT.labelCol"
            :wrapperCol="FULL_FORM_LAYOUT.wrapperCol">
            <div class="traces scrollbar">
              <template v-for="(item, index) in traces">
                <p :key="index">
                  <a-tag color="red" v-if="item.indexOf('com.easy.restful') > -1">
                    {{ item }}
                  </a-tag>
                  <template v-else>{{ item }}</template>
                </p>
              </template>
            </div>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
import { FORM_LAYOUT, FULL_FORM_LAYOUT } from '@/utils/const/form'
import { get } from '@/api/sys/exception'
import { DATE_PATTERN } from '@/utils/const/datePattern'

export default {
  name: 'SysExceptionInput',
  data () {
    return {
      id: this.$route.query.id,

      // 表单
      FORM_LAYOUT: FORM_LAYOUT,
      FULL_FORM_LAYOUT: FULL_FORM_LAYOUT,
      DATE_PATTERN: DATE_PATTERN,
      model: {},
      traces: []
    }
  },
  created () {
    get(this.id).then((res) => {
      this.model = res.data
      this.traces = this.model.trace.split('\n')
    })
  }
}
</script>

<style scoped>
.traces p {
  margin-bottom: 0;
  line-height: 30px;
}
</style>
