<template>
  <a-date-picker v-model="currentValue" :disabled="disabled" placeholder="" @change="handleChange"/>
</template>
<script>
  import { DATE_PATTERN } from '@/utils/const/datePattern'
  import moment from 'moment'

  export default {
    name: 'EDatePicker',
    props: {
      placeholder: {
        type: String,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      },
      value: {
        type: [String, Date, Number],
        default: null
      },
      datePattern: {
        type: String,
        default: DATE_PATTERN.NORM_DATE_PATTERN
      }
    },
    data () {
      return {
        currentValue: this.convertToMoment(this.value)
      }
    },
    watch: {
      value (newValue) {
        this.currentValue = this.convertToMoment(newValue)
      }
    },
    methods: {
      convertToMoment (object) {
        if (object) {
          if (typeof object === 'string') {
            return moment(this.value, this.datePattern)
          } else {
            return moment(object)
          }
        } else {
          return null
        }
      },
      handleChange () {
        this.$emit('input', this.currentValue.format(this.datePattern))
        // this.$emit('change')
      }
    }
  }
</script>
