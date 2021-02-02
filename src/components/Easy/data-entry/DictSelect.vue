<template>
  <a-select
    style="width: 100%"
    show-search
    option-filter-prop="children"
    :mode="mode"
    :placeholder="placeholder"
    :disabled="disabled"
    v-model="currentValue"
    :allowClear="allowClear"
    @change="handleChange"
  >
    <a-select-option v-for="item in dictArray" :key="item.code">
      {{ item.name }}
    </a-select-option>
  </a-select>
</template>
<script>
import { getSysDictArrayByDictType, isBlank } from '@/utils/util'
import PropTypes from 'ant-design-vue/es/_util/vue-types'

export default {
  name: 'EDictSelect',
  props: {
    mode: PropTypes.string.def(),
    placeholder: PropTypes.string.def(),
    disabled: PropTypes.bool.def(false),
    allowClear: PropTypes.bool.def(true),
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
      currentValue: this.value
    }
  },
  watch: {
    value (newValue) {
      this.currentValue = newValue
    }
  },
  created () {
    if (isBlank(this.type)) {
      this.error = '字典类型[参数type]不能为空'
    }
    this.dictArray = getSysDictArrayByDictType(this.type)
  },
  methods: {
    handleChange () {
      this.$emit('input', this.currentValue)
      this.$emit('change', this.currentValue)
    }
  }
}
</script>
