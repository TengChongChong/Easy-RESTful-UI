<template>
  <a-card title="请假" :bordered="false">
    <a-form-model
      ref="form"
      :model="model"
      :rules="rules"
      :label-col="FORM_LAYOUT.labelCol"
      :wrapper-col="FORM_LAYOUT.wrapperCol">
      <a-form-model-item label="类型" prop="leaveType">
        <e-dict-select type="leaveType" v-model="model.leaveType"/>
      </a-form-model-item>
      <a-form-model-item label="时间" prop="startDate">
        <a-input style="display: none" v-model="model.startDate"/>
        <a-range-picker
          :show-time="{ format: 'HH:mm' }"
          :format="dateFormat"
          :placeholder="['开始时间', '结束时间']"
          v-model="rangePickerValue"
          @change="onChange"
        />
      </a-form-model-item>
      <a-form-model-item label="原因">
        <a-textarea v-model="model.reason"/>
      </a-form-model-item>
      <div class="input-btn-group">
        <e-btn-save :loading="saveLoading" :click-callback="save"/>
      </div>
    </a-form-model>
  </a-card>
</template>

<script>
import { FORM_LAYOUT } from '@/utils/const/form'
import { get, save } from '@/api/sample/work-flow'
import { saveSuccessTip } from '@/utils/tips'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'
import { isNotBlank } from '@/utils/util'
import EBtnSave from '@/components/Easy/general/BtnSave'
import moment from 'moment'

export default {
  name: 'SampleWorkFlowInput',
  components: {
    EBtnSave,
    EDictSelect
  },
  data () {
    return {
      id: this.$route.query.id,
      dateFormat: 'YYYY-MM-DD HH:mm',
      rangePickerValue: [],
      // 表单
      saveLoading: false,
      FORM_LAYOUT: FORM_LAYOUT,
      model: {
        startDate: null
      },
      rules: {
        leaveType: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请输入时间', trigger: 'blur' }
        ],
        reason: [
          { max: 200, message: '原因不能超过200个字符', trigger: 'blur' }
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
        if (isNotBlank(this.model.startDate) && isNotBlank(this.model.endDate)) {
          this.rangePickerValue = [moment(new Date(this.model.startDate), this.dateFormat), moment(new Date(this.model.endDate), this.dateFormat)]
        }
      })
    },
    onChange (value, dateString) {
      this.model.startDate = dateString[0]
      this.model.endDate = dateString[1]
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
