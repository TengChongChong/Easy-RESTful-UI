<template>
  <span>
    <a-tag v-if="dict && dict.css" :color="dict.css">{{ dict.name }}</a-tag>
    <template v-else>{{ dict.name }}</template>
  </span>
</template>
<script>
import { getSysDictObjectByQuery, isBlank } from '@/utils/util'
import PropTypes from 'ant-design-vue/es/_util/vue-types'

export default {
  name: 'EDictTag',
  props: {
    type: PropTypes.string.def(),
    code: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
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
