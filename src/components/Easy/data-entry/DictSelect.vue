<template>
  <a-select
    style="min-width: 120px"
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

  export default {
    name: 'DictSelect',
    props: {
      mode: {
        type: String,
        default: null
      },
      placeholder: {
        type: String,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      },
      allowClear: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: null
      },
      value: {
        type: [String, Number, Array],
        default: null
      }
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
        this.$emit('change')
      }
    }
  }
</script>
