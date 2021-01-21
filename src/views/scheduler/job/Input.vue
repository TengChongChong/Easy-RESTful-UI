<template>
  <a-card title="定时任务" :bordered="false">
    <a-form-model
      ref="form"
      :model="model"
      :rules="rules"
      :label-col="formLayout.labelCol"
      :wrapper-col="formLayout.wrapperCol">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="名称" prop="name">
            <a-input v-model="model.name"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="代码" prop="code">
            <a-input v-model="model.code"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="cron" prop="cron">
            <a-input v-model="model.cron"/>
          </a-form-model-item>
        </a-col>

        <a-col :lg="12" :sm="24">
          <a-form-model-item label="状态" prop="status">
            <e-dict-radio name="status" v-model="model.status" type="schedulerJobStatus"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="Bean" prop="bean">
            <a-input v-model="model.bean"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="Method" prop="method">
            <a-input v-model="model.method"/>
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <a-form-model-item
            label="备注"
            :labelCol="FULL_FORM_LAYOUT.labelCol"
            :wrapperCol="FULL_FORM_LAYOUT.wrapperCol"
            prop="tips">
            <a-textarea v-model="model.tips"/>
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <div class="input-btn-group">
            <e-btn-save :loading="saveLoading" :click-callback="save"/>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
import { FORM_LAYOUT, FULL_FORM_LAYOUT } from '@/utils/const/form'
import { get, save } from '@/api/scheduler/job'
import { saveSuccessTip } from '@/utils/tips'
import { isNotBlank } from '@/utils/util'
import EBtnSave from '@/components/Easy/general/BtnSave'
import { DATA_TYPE_CONST } from '@/utils/const/sys/DataTypeConst'
import EDictRadio from '@/components/Easy/data-entry/DictRadio'
import { SCHEDULER_STATUS_CONST } from '@/utils/const/scheduler/SchedulerStatusConst'

export default {
  name: 'SchedulerJobInput',
  components: {
    EDictRadio,
    EBtnSave
  },
  data () {
    return {
      id: this.$route.query.id,

      // 表单
      DATA_TYPE_CONST: DATA_TYPE_CONST,
      saveLoading: false,
      formLayout: FORM_LAYOUT,
      FULL_FORM_LAYOUT: FULL_FORM_LAYOUT,
      SCHEDULER_STATUS_CONST: SCHEDULER_STATUS_CONST,
      model: {
        status: SCHEDULER_STATUS_CONST.ENABLE
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 20, message: '名称不能超过20个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入代码', trigger: 'blur' },
          { max: 20, message: '代码不能超过20个字符', trigger: 'blur' }
        ],
        cron: [
          { required: true, message: '请输入cron', trigger: 'blur' },
          { max: 50, message: 'cron不能超过50个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        bean: [
          { required: true, message: '请输入Bean', trigger: 'blur' },
          { max: 250, message: 'Bean不能超过250个字符', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请输入Method', trigger: 'blur' },
          { max: 50, message: 'Method不能超过50个字符', trigger: 'blur' }
        ],
        tips: [
          { max: 200, message: '备注不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (isNotBlank(this.id)) {
      this.edit(this.id)
    }
  },
  methods: {
    edit (id) {
      get(id).then((res) => {
        this.model = res.data
      })
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveLoading = true
          save(this.model).then((res) => {
            this.saveLoading = false
            saveSuccessTip()
          }).catch(({ response }) => {
            this.saveLoading = false
          })
        }
      })
    }
  }
}
</script>
