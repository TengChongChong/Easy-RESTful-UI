<template>
  <span>
    <a-tooltip placement="top">
      <template slot="title">
        <span>{{ name }}</span>
      </template>
      <a-button type="primary" :loading="loading" size="small" :icon="icon" @click="start"/>
    </a-tooltip>
    <a-divider v-if="divider" type="vertical" />

    <!--  发起流程  -->
    <a-modal v-model="startModalVisible" :confirm-loading="startConfirmLoading" title="发起流程" @ok="startWithStartForm">
      <a-form-model
        ref="form"
        :model="model"
        :rules="rules"
        :label-col="formLayout.labelCol"
        :wrapper-col="formLayout.wrapperCol">
        <a-form-model-item v-for="item in startForm" :key="item.id" :label="item.name" :prop="item.id">
          <a-input v-if="'string' === item.typeCode" v-model="model[item.id]"/>
          <a-input-number v-if="'long' === item.typeCode" v-model="model[item.id]"/>
          <e-date-picker v-if="'date' === item.typeCode" :date-pattern="item.datePattern" v-model="model[item.id]"/>
          <e-dict-radio :name="item.id" type="boolean" v-if="'boolean' === item.typeCode" v-model="model[item.id]"/>
          <a-select v-if="'enum' === item.typeCode" v-model="model[item.id]">
            <a-select-option :key="value" v-for="(text, value) in item.values">{{ text }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </span>
</template>
<script>
  import { FORM_LAYOUT } from '@/utils/const/form'
  import { selectProcessDefinitionId } from '@/api/activiti/model'
  import { startProcessInstance } from '@/api/activiti/processDefinition'
  import { successTip } from '@/utils/tips'
  import { isBlank, refreshList } from '@/utils/util'
  import EDictRadio from '@/components/Easy/data-entry/DictRadio'
  import EDatePicker from '@/components/Easy/data-entry/DatePicker'
  import notification from 'ant-design-vue/lib/notification'

  export default {
    name: 'EBtnWorkFlowStart',
    components: { EDatePicker, EDictRadio },
    props: {
      name: {
        type: String,
        default: '提交'
      },
      icon: {
        type: String,
        default: 'check'
      },
      divider: {
        type: Boolean,
        default: true
      },
      modelKey: {
        required: true,
        type: String,
        default: null
      },
      businessKey: {
        required: true,
        type: String,
        default: null
      },
      businessTitle: {
        required: true,
        type: String,
        default: null
      },
      businessDetailsPath: {
        required: true,
        type: String,
        default: null
      },
      params: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        loading: false,

        // -- 发起流程
        startModalVisible: false,
        startConfirmLoading: false,
        startForm: [], // 发起时表单
        formLayout: FORM_LAYOUT,
        model: {},
        rules: {}
      }
    },
    watch: {
    },
    methods: {
      /**
       * 启动流程
       */
      start () {
        if (isBlank(this.businessDetailsPath)) {
          notification.warn({
            message: '失败',
            description: 'businessDetailsPath不能为空'
          })
          return
        }
        if (this.businessDetailsPath.indexOf('views') !== 0) {
          console.warn('组件地址请改为view开头')
          return
        }

        this.loading = true
        selectProcessDefinitionId(this.modelKey).then(res => {
          startProcessInstance({
            processDefinitionId: res.data,
            businessKey: this.businessKey,
            businessTitle: this.businessTitle,
            businessDetailsPath: this.businessDetailsPath,
            extentParams: this.params,
            hasFormData: false
          }).then(res => {
            this.loading = false
            if (res.data.hasStartFormKey) {
              // 外置表单key
            } else if (res.data.hasStartForm) {
              // 清空内容
              this.model = {}
              // 有动态表单，打开模态框填写
              this.startForm = res.data.startFormData
              // 生成表单验证
              this.generatorFormRules()
              this.startModalVisible = true
            } else {
              successTip('流程已启动，实例ID：' + res.data.processInstanceId)
              refreshList(this)
            }
          }).catch(res => {
            this.loading = false
          })
        }).catch(res => {
          this.loading = false
        })
      },
      /**
       * 发起流程，包含动态表单数据
       */
      startWithStartForm () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.startConfirmLoading = true
            selectProcessDefinitionId(this.modelKey).then(res => {
              // 合并参数
              const params = Object.assign(this.params || {}, this.model)
              startProcessInstance({
                processDefinitionId: res.data,
                businessKey: this.businessKey,
                businessTitle: this.businessTitle,
                businessDetailsPath: this.businessDetailsPath,
                extentParams: params,
                hasFormData: true
              }).then(res => {
                this.startModalVisible = false
                successTip('流程已启动，实例ID：' + res.data.processInstanceId)
                this.refreshList()
              }).then(() => {
                this.startConfirmLoading = false
              })
            }).then(() => {
              this.startConfirmLoading = false
            })
          }
        })
      },
      /**
       * 生成表单验证
       */
      generatorFormRules () {
        this.rules = {}
        this.startForm.map(item => {
          this.rules[item.id] = []
          if (item.required) {
            this.rules[item.id].push({
              required: true, message: `请输入${item.name}`, trigger: 'blur'
            })
          }
        })
      },
      refreshList () {
        refreshList(this)
      }
    }
  }
</script>
