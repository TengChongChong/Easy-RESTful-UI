<template>
  <a-card title="代码生成示例" :bordered="false">
    <a-form-model
      ref="form"
      :model="model"
      :rules="rules"
      :label-col="FORM_LAYOUT.labelCol"
      :wrapper-col="FORM_LAYOUT.wrapperCol">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="姓名" prop="name">
            <a-input v-model="model.name"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="性别" prop="sex">
            <e-dict-select type="sex" v-model="model.sex"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="年龄" prop="age">
            <a-input-number v-model="model.age"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="手机号码" prop="phone">
            <a-input v-model="model.phone"/>
          </a-form-model-item>
        </a-col>
        <a-col :lg="12" :sm="24">
          <a-form-model-item label="状态" prop="status">
            <e-dict-select type="commonStatus" v-model="model.status"/>
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <a-form-model-item label="地址" :labelCol="FULL_FORM_LAYOUT.labelCol" :wrapperCol="FULL_FORM_LAYOUT.wrapperCol" prop="address">
            <a-input v-model="model.address"/>
          </a-form-model-item>
        </a-col>

        <a-col :sm="24">
          <div class="input-btn-group">
            <e-btn-save permissions="sample:general:save" :loading="saveLoading" :click-callback="save"/>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
import { FULL_FORM_LAYOUT, FORM_LAYOUT } from '@/utils/const/form'
import { get, save } from '@/api/sample/general'
import { saveSuccessTip } from '@/utils/tips'
import { isNotBlank } from '@/utils/util'
import EBtnSave from '@/components/Easy/general/BtnSave'
import EDictSelect from '@/components/Easy/data-entry/DictSelect'

export default {
  name: 'SampleGeneralInput',
  components: {
    EBtnSave,
    EDictSelect
  },
  data () {
    return {
      id: this.$route.query.id,

      FULL_FORM_LAYOUT: FULL_FORM_LAYOUT,
      FORM_LAYOUT: FORM_LAYOUT,

      // 表单
      saveLoading: false,
      model: { },
      rules: {
        name: [
          { max: 16, message: '姓名不能超过16个字符', trigger: 'blur' }
        ],
        age: [
        ],
        phone: [
          { max: 16, message: '手机号码不能超过16个字符', trigger: 'blur' }
        ],
        address: [
          { max: 16, message: '地址不能超过16个字符', trigger: 'blur' }
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
            this.model = res.data
          }).catch(({ response }) => {
            this.saveLoading = false
          })
        }
      })
    }
  }
}
</script>
