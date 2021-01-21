<template>
  <span>
    <a-tag v-if="dict && dict.css" :color="dict.css">{{ dict.name }}</a-tag>
    <template v-else>{{ dict.name }}</template>
  </span>
</template>
<script>
  import { getSysDictObjectByQuery, isBlank } from '@/utils/util'

  export default {
    name: 'EDictTag',
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
        dict: {}
      }
    },
    watch: {
      code () {
        this.dict = getSysDictObjectByQuery(this.type, this.code) || {}
      }
    },
    created () {
      if (isBlank(this.type)) {
        console.error('[参数type]为空')
        this.dict = { name: '-' }
        return
      }
      if (isBlank(this.code)) {
        console.warn('[参数code]为空')
        this.dict = { name: '-' }
        return
      }
      this.dict = getSysDictObjectByQuery(this.type, this.code)
    }
  }
</script>
