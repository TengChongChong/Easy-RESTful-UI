<template>
  <a-date-picker
    v-model="currentValue"
    :disabled="disabled"
    :show-time="showTime"
    :format="datePattern"
    placeholder=""
    @change="handleChange"/>
</template>
<script>
import { DATE_PATTERN } from '@/utils/const/datePattern'
import moment from 'moment'
import PropTypes from 'ant-design-vue/es/_util/vue-types'

export default {
  name: 'EDatePicker',
  props: {
    placeholder: PropTypes.string.def(),
    disabled: PropTypes.bool.def(false),
    value: {
      type: [String, Date, Number],
      default: null
    },
    datePattern: PropTypes.string.def(DATE_PATTERN.NORM_DATE_PATTERN)
  },
  data () {
    return {
      showTime: null,
      timePattern: null,
      currentValue: this.convertToMoment(this.value)
    }
  },
  watch: {
    value (newValue) {
      this.currentValue = this.convertToMoment(newValue)
    },
    datePattern (newValue) {
      this.timePattern = newValue
      this.setShowTime()
    }
  },
  created () {
    this.setShowTime()
  },
  methods: {
    /**
     * 设置是否显示时间选择器以及各式
     */
    setShowTime () {
      const timePattern = this.datePattern.match(/[H|h|k](\S*)/)
      if (timePattern) {
        this.timePattern = timePattern[0]
        if (this.timePattern) {
          this.showTime = {
            format: this.timePattern
          }
        } else {
          this.showTime = false
        }
      }
    },
    /**
     * 将传入value转为需要的格式
     *
     * @param object {string|object} value
     * @return {moment.Moment|null}
     */
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
    }
  }
}
</script>
