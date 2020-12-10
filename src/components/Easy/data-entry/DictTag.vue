<template>
  <span>
    <a-tag v-if="dict.css" :color="error != null ? 'red' : dict.css">{{ error != null ? error : dict.name }}</a-tag>
    <template v-else>{{ dict.name }}</template>
  </span>
</template>
<script>
  import { getSysDictObjectByQuery, isBlank } from '@/utils/util'

  export default {
    name: 'DictTag',
    props: {
      type: {
        type: String,
        default: null
      },
      code: {
        type: [String, Number],
        default: null
      }
    },
    data () {
      return {
        dict: {},
        error: null
      }
    },
    created () {
      if (isBlank(this.type)) {
        this.error = '字典类型[参数type]不能为空'
      }
      if (isBlank(this.code)) {
        this.error = '字典编码[参数code]不能为空'
      }
      this.dict = getSysDictObjectByQuery(this.type, this.code)
    }
  }
</script>
