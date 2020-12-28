<template>
  <a-checkbox-group :name="name" v-model="currentValue" :disabled="disabled" @change="handleChange">
    <a-checkbox v-for="item in dictArray" :key="item.code" :value="item.code">
      {{ item.name }}
    </a-checkbox>
  </a-checkbox-group>
</template>
<script>
  import { getSysDictArrayByDictType, isBlank } from '@/utils/util'

  export default {
    name: 'EDictCheckbox',
    props: {
      name: {
        type: String,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
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
        this.currentValue = []
        if (typeof value === 'number') {
          this.currentValue.push(value + '')
        } else if (typeof value === 'string') {
          this.currentValue.push(value)
        } else if (value && Array.isArray(value)) {
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
