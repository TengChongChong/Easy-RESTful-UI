<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="rules"
    :label-col="formLayout.labelCol"
    :wrapper-col="formLayout.wrapperCol">
    <a-row class="form-row" :gutter="16">
      <a-col>
        <a-form-model-item label="收信人" prop="receiver">
          <a-select v-model="model.receiver"/>
        </a-form-model-item>
        <a-form-model-item label="主题" prop="title">
          <a-input v-model="model.title"/>
        </a-form-model-item>
        <a-form-model-item label="重要" prop="important">
          <a-switch v-model="model.important" />
        </a-form-model-item>
        <a-form-model-item label="内容" prop="content">
          <a-textarea v-model="model.content"/>
        </a-form-model-item>
      </a-col>
      <a-col :sm="24">
        <div class="input-btn-group">
          <e-btn-save :click-callback="save"/>
        </div>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script>
import EDatePicker from '@/components/Easy/data-entry/DatePicker'
import EDictRadio from '@/components/Easy/data-entry/DictRadio'
import EBtnSave from '@/components/Easy/general/BtnSave'

export default {
  components: {
    EBtnSave,
    EDictRadio,
    EDatePicker
  },
  data () {
    return {
      formLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      model: {},
      rules: {

      }
    }
  },
  methods: {
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {

        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
