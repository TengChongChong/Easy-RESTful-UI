<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="rules"
    :label-col="formLayout.labelCol"
    :wrapper-col="formLayout.wrapperCol">
    <a-row class="form-row" :gutter="16">
      <a-col>
        <a-form-model-item label="收信人" prop="receivers">
          <e-user-search-select mode="multiple" placeholder="输入用户名、昵称、部门查询用户" v-model="model.receivers"/>
        </a-form-model-item>
        <a-form-model-item label="主题" prop="title">
          <a-input v-model="model.title"/>
        </a-form-model-item>
        <a-form-model-item label="重要" prop="important">
          <a-switch v-model="important"/>
        </a-form-model-item>
        <a-form-model-item label="内容" prop="content">
          <div id="content"></div>
        </a-form-model-item>
      </a-col>
      <a-col :sm="24">
        <div class="input-btn-group" v-if="showBtn">
          <e-btn-save :click-callback="save"/>
          <a-button type="primary" icon="check-circle" @click="saveAndSend">保存并发送</a-button>
        </div>
        <div class="input-btn-group" v-else>
          <a-button type="primary" icon="check-circle" @click="newMessage">写消息</a-button>
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
import { save, get } from '@/api/sys/message'
import TagSelectOption from '@/components/TagSelect/TagSelectOption'
import EUserSearchSelect from '@/components/Easy/data-entry/UserSearchSelect'
import { saveSuccessTip } from '@/utils/tips'
import { MESSAGE_CONST } from '@/utils/const/sys/MessageConst'
import { isNotBlank } from '@/utils/util'

export default {
  props: {
    id: {
      type: String,
      default: null
    }
  },
  components: {
    EUserSearchSelect,
    TagSelectOption,
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
      editor: null,
      model: {
        receivers: [],
        title: null,
        important: null,
        content: null,
        status: MESSAGE_CONST.STATUS_DRAFT
      },

      important: false,
      // 显示按钮
      showBtn: true,
      rules: {
        receivers: [
          { required: true, message: '请选择收信人', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入主题', trigger: 'blur' },
          { max: 100, message: '主题字数不能超过100个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    if (isNotBlank(this.id)) {
      get(this.id).then(res => {
        this.model = res.data
        if (this.model.content) {
          editor.txt.html(this.model.content)
        }
      })
    }
    const editor = new WangEditor(`#content`)
    editor.config.zIndex = 1
    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = (newHtml) => {
      this.model.content = newHtml
    }
    // 创建编辑器
    editor.create()
    this.editor = editor
    this.important = MESSAGE_CONST.IMPORTANT_YES === this.model.important
  },
  methods: {
    saveAndSend () {
      this.model.status = MESSAGE_CONST.STATUS_HAS_BEEN_SENT
      this.save()
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.model.important = this.important ? MESSAGE_CONST.IMPORTANT_YES : MESSAGE_CONST.IMPORTANT_NO
          save(this.model).then(res => {
            saveSuccessTip()
            if (MESSAGE_CONST.STATUS_HAS_BEEN_SENT === res.data.status) {
              this.showBtn = false
            }
          })
        }
      })
    },
    newMessage () {
      this.model = {
        receivers: [],
        title: null,
        important: null,
        content: null,
        status: MESSAGE_CONST.STATUS_DRAFT
      }
      this.editor.txt.html('')
    }
  },
  beforeDestroy () {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  }
}
</script>
