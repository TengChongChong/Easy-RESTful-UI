<template>
  <a-card title="任务办理" :bordered="false">
    <a-form-model
      v-if="task && task.id"
      ref="form"
      :model="model"
      :rules="rules"
      :label-col="FORM_LAYOUT.labelCol"
      :wrapper-col="FORM_LAYOUT.wrapperCol">
      <component v-if="variables != null" :is="businessDetails" :id="processInstance.businessKey"/>
      <a-divider style="margin: 0">发起人</a-divider>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="发起人">
            <e-avatar :avatar="applyUser.avatar" :nickname="applyUser.nickname"/>
            [{{ applyUser.deptName }}] {{ applyUser.nickname }}
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="发起时间">
            {{ task.createTime }}
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-divider style="margin: 0" v-if="taskFormData && taskFormData.length > 0">审核意见</a-divider>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :sm="24">
          <a-form-model-item v-for="item in taskFormData" :key="item.id" :label="item.name" :prop="item.id">
            <a-input v-if="'string' === item.typeCode" v-model="model[item.id]"/>
            <a-input-number v-if="'long' === item.typeCode" v-model="model[item.id]"/>
            <e-date-picker v-if="'date' === item.typeCode" :date-pattern="item.datePattern" v-model="model[item.id]"/>
            <e-dict-radio :name="item.id" type="boolean" v-if="'boolean' === item.typeCode" v-model="model[item.id]"/>
            <a-select v-if="'enum' === item.typeCode" v-model="model[item.id]">
              <a-select-option :key="value" v-for="(text, value) in item.values">{{ text }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <div class="input-btn-group">
            <a-button type="primary" icon="check" v-if="showBtn" :loading="completeTaskBtnLoading" @click="completeTask">
              提交
            </a-button>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
import { completeTask, get } from '@/api/activiti/task'
  import EDictSelect from '@/components/Easy/data-entry/DictSelect'
  import { formatDate, isBlank, isNotBlank } from '@/utils/util'
  import EBtnSave from '@/components/Easy/general/BtnSave'
  import { FORM_LAYOUT } from '@/utils/const/form'
  import { DATE_PATTERN } from '@/utils/const/datePattern'
  import EAvatar from '@/components/Easy/data-display/Avatar'
import EDatePicker from '@/components/Easy/data-entry/DatePicker'
import EDictRadio from '@/components/Easy/data-entry/DictRadio'
import { successTip } from '@/utils/tips'

  export default {
    name: 'ActivitiTaskInput',
    components: {
      EDictRadio,
      EDatePicker,
      EAvatar,
      EBtnSave,
      EDictSelect
    },
    data () {
      return {
        id: this.$route.params.id,
        saveLoading: false,
        FORM_LAYOUT: FORM_LAYOUT,
        DATE_PATTERN: DATE_PATTERN,
        applyUser: {},
        task: {},
        taskFormData: [],
        startFormData: [],
        variables: {},
        processInstance: {},
        businessDetails: null,
        model: {},
        rules: {},
        completeTaskBtnLoading: false,
        showBtn: true
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
          this.model = {}
          this.applyUser = res.data.applyUser
          this.task = res.data.task
          this.taskFormData = res.data.taskFormData
          this.startFormData = res.data.startFormData
          this.variables = res.data.variables
          this.processInstance = res.data.processInstance
          this.task.createTime = formatDate(this.task.createTime, DATE_PATTERN.NORM_DATETIME_MINUTE_PATTERN)
          this.generatorFormRules()
          // 业务详情组件
          if (isBlank(this.variables.businessDetailsPath)) {
            console.warn('业务详情组件获取失败')
            return
          }
          if (this.variables.businessDetailsPath.indexOf('@/view') === 0) {
            console.warn('组件地址不能用@/view开头，请改为view开头')
            return
          }
          // 这里组件路径两端必须有字符串，不然会报错
          this.businessDetails = () => import(`@/${this.variables.businessDetailsPath}.vue`)
        })
      },
      /**
       * 生成表单验证
       */
      generatorFormRules () {
        this.rules = {}
        if (this.taskFormData) {
          this.taskFormData.map(item => {
            this.rules[item.id] = []
            if (item.required) {
              this.rules[item.id].push({
                required: true, message: `请输入${item.name}`, trigger: 'blur'
              })
            }
          })
        }
      },
      completeTask () {
        this.$refs.form.validate(valid => {
          this.completeTaskBtnLoading = true
          completeTask(this.task.id, this.model).then(res => {
            successTip('办理成功')
            this.showBtn = false
          }).catch(() => {
            this.completeTaskBtnLoading = false
          })
        })
      }
    }
  }
</script>
<style scoped>
iframe {
  width: 100%;
}
</style>
