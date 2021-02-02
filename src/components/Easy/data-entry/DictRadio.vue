<template>
  <a-radio-group :name="name" v-model="currentValue" :disabled="disabled" @change="handleChange">
    <a-radio v-for="item in dictArray" :key="item.code" :value="item.code">
      {{ item.name }}
    </a-radio>
  </a-radio-group>
</template>
<script>
import { getSysDictArrayByDictType, isBlank } from '@/utils/util'
import PropTypes from 'ant-design-vue/es/_util/vue-types'

export default {
  name: 'EDictRadio',
  props: {
    name: PropTypes.string.def(),
    disabled: PropTypes.bool.def(false),
    type: {
      required: true,
      type: String,
      default: null
    },
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  },
  data () {
    return {
      dictArray: {},
      error: null,
      currentValue: []
    }
  },
  watch: {
    value (newValue) {
      this.setDefaultValue(newValue)
    }
  },
  created () {
    if (isBlank(this.type)) {
      this.error = '字典类型[参数type]不能为空'
    }
    this.dictArray = getSysDictArrayByDictType(this.type)
    this.setDefaultValue(this.value)
  },
  methods: {
    setDefaultValue (value) {
      this.currentValue = null
      if (typeof value === 'number') {
        this.currentValue = value + ''
      } else if (typeof value === 'string') {
        this.currentValue = value
      }
    },
    handleChange (e) {
      this.$emit('input', this.currentValue)
      this.$emit('change')
    }
  }
}
</script>
