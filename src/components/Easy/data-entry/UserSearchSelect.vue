<template>
  <a-select
    class="user-select"
    :mode="mode"
    :placeholder="placeholder"
    :disabled="disabled"
    v-model="currentValue"
    :allowClear="allowClear"
    :filter-option="false"
    show-search
    :not-found-content="fetching ? undefined : null"
    @search="selectUser"
    @change="handleChange"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
    <a-select-option :key="item.id" v-for="item in selectOptions">
      <span role="img" aria-label="China">
        <e-avatar :avatar="item.avatar" :nickname="item.nickname"/>
      </span>
      <a-tag color="blue" style="margin-left: 10px">{{ item.deptName }}</a-tag>
      {{ item.nickname }}
    </a-select-option>
  </a-select>
</template>
<script>
import { selectByKeyword, selectUsersByIds } from '@/api/sys/user'
import { isNotBlank } from '@/utils/util'
import EAvatar from '@/components/Easy/data-display/Avatar'
import PropTypes from 'ant-design-vue/es/_util/vue-types'

export default {
  name: 'EUserSearchSelect',
  components: { EAvatar },
  props: {
    mode: PropTypes.string.def(),
    placeholder: PropTypes.string.def(),
    disabled: PropTypes.bool.def(false),
    allowClear: PropTypes.bool.def(true),
    type: PropTypes.string.def(),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  },
  data () {
    return {
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,

      fetching: false,
      selectOptions: [],

      currentValue: null
    }
  },
  created () {
    this.setValue(this.value)
  },
  watch: {
    value (newValue) {
      // 如果值不同重新设置
      let isEqual = false
      if (newValue && Array.isArray(newValue)) {
        isEqual = this.currentValue.length === newValue.length && this.currentValue.filter(t => !newValue.includes(t))
      } else {
        isEqual = this.currentValue === newValue
      }
      if (!isEqual) {
        this.setValue(newValue)
        console.log('newValue', newValue)
      }
    }
  },
  methods: {
    /**
     * 设置选中项
     *
     * @param value 选中项
     */
    setValue (value) {
      this.currentValue = value
      if (this.mode === 'multiple' && typeof value === 'undefined') {
        // 如果是多选，value必须为数组
        this.currentValue = []
      }
      if (this.currentValue == null || this.currentValue === '' || this.currentValue.length === 0) {
        this.selectOptions = []
        return
      }
      this.fetching = true
      const ids = value && Array.isArray(value) ? value.join(',') : value
      selectUsersByIds(ids).then(res => {
        this.selectOptions = res.data
        this.fetching = false
      })
    },
    /**
     * 查询用户
     *
     * @param value 关键字
     */
    selectUser (value) {
      if (isNotBlank(value)) {
        this.fetching = true
        selectByKeyword(value).then(res => {
          this.selectOptions = res.data.data
          this.fetching = false
        })
      }
    },
    /**
     * change 事件
     *
     * @param value
     */
    handleChange (value) {
      this.currentValue = value
      this.$emit('input', value)
      this.$emit('change')
    }
  }
}
</script>
<style lang="less">
.user-select {
  .ant-select-selection--multiple > ul > li,
  .ant-select-selection--multiple .ant-select-selection__rendered > ul > li {
    height: 36px;
    margin-top: 3px;
    line-height: 32px;
  }

  .ant-select-selection__rendered {
    line-height: 42px;
  }

  .ant-select-selection--multiple .ant-select-selection__clear, .ant-select-selection--multiple .ant-select-arrow {
    top: 22px;
  }

  .ant-select-selection--single {
    height: 44px;
  }
}

</style>
