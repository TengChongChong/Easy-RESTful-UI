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
          <a-switch v-model="model.important"/>
        </a-form-model-item>
        <a-form-model-item label="内容" prop="content">
          <div id="content"></div>
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
import WangEditor from 'wangeditor'

export default {
  components: {
    EBtnSave,
    EDictRadio,
    EDatePicker,
    WangEditor
  },
  data () {
    return {
      formLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      model: {
        content: null
      },
      rules: {},
      editor: null
    }
  },
  mounted () {
    const editor = new WangEditor(`#content`)
    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = (newHtml) => {
      console.log('newHtml', newHtml)
      this.model.content = newHtml
    }
    // 创建编辑器
    editor.create()
    this.editor = editor
  },
  methods: {
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {

        }
      })
    }
  },
  beforeDestroy () {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  }
}
</script>
