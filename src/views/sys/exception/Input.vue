<template>
  <a-card title="系统参数" :bordered="false">
    <a-form-model
      ref="form"
      :model="model"
      :label-col="formLayout.labelCol"
      :wrapper-col="formLayout.wrapperCol">
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
            {{ model.triggerTime }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="请求地址">
            {{ model.url }}
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <a-form-model-item label="异常信息" :labelCol="{ span: 3 }" :wrapperCol="{ span: 19 }">
            {{ model.message }}
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <a-form-model-item label="异常信息" :labelCol="{ span: 3 }" :wrapperCol="{ span: 19 }">
            <div class="traces">
              <template v-for="item in traces">
                <p :key="item">
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
import { FORM_LAYOUT } from '@/utils/const/form'
import { get } from '@/api/sys/exception'

export default {
  name: 'SysExceptionInput',
  data () {
    return {
      id: this.$route.query.id,

      // 表单
      formLayout: FORM_LAYOUT,
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
