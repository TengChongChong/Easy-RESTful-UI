<template>
  <a-upload
    name="file"
    :accept="accept"
    :file-list="fileList"
    :disabled="disabled"
    :multiple="multiple"
    :action="`${VUE_APP_API_BASE_URL}/auth/file/upload`"
    :headers="headers"
    :before-upload="beforeUpload"
    :remove="handleRemove"
    @change="handleChange"
  >
    <a-button>
      <slot>
        <a-icon type="upload"/>
        选择文件
      </slot>
    </a-button>
  </a-upload>
</template>
<script>
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getUniqueID } from '@/utils/util'
// import { getUniqueID } from '@/utils/util'

export default {
  name: 'EUpload',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: null
    },
    // 接受上传的文件类型 详见 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
    accept: {
      type: String,
      default: null
    },
    // 设置最多可以上传多少文件
    maxFiles: {
      type: Number,
      default: 1
    },
    // 设置上传文件的大小限制[MB为单位]
    maxFileSize: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
      headers: {
        'Access-Token': storage.get(ACCESS_TOKEN)
      },
      fileList: this.initFileList(this.value || [])
    }
  },
  watch: {
    value (newValue) {
      this.fileList = this.initFileList(newValue)
    }
  },
  methods: {
    initFileList (items) {
      const fileList = []
      items.map((item) => {
        const file = {
          uid: item.uid || item.id || getUniqueID('uid'),
          name: item.name,
          type: item.type,
          size: item.size || item.length,
          status: item.status || 'done',
          path: item.path || (item.response && item.response.data ? item.response.data.path : null),
          url: item.url || (item.response && item.response.data ? item.response.data.url : null)
        }
        file.url = file.url ? this.VUE_APP_API_BASE_URL + file.url : null
        fileList.push(file)
      })
      return fileList
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload (file) {
      if (file.size / 1024 / 1024 > this.maxFileSize) {
        this.$message.error(`文件大小超出限制，不能超过${this.maxFileSize}MB`)
        return false
      }
      if (this.maxFiles < this.fileList.length + 1) {
        this.$message.error(`最多允许上传${this.maxFiles}个文件`)
        return false
      }
      return true
    },
    handleChange (info) {
      if (info.file.status) {
        if (info.file.status === 'done') {
          this.$message.success(`${info.file.name} 上传成功`)
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name || ''} 上传失败`)
        }
        this.$emit('input', this.initFileList(info.fileList))
      }
    }
  }
}
</script>
