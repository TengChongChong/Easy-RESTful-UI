<template>
  <a-button
    v-if="permissions == null || permissions === '' || $permissions(permissions)"
    type="primary"
    :icon="icon"
    @click="onClick">
    <slot>新增</slot>
  </a-button>
</template>
<script>
import { openView } from '@/utils/util'
import PropTypes from 'ant-design-vue/es/_util/vue-types'

export default {
  name: 'EBtnAdd',
  props: {
    permissions: PropTypes.string.def(),
    tabName: PropTypes.string.def('新增'),
    icon: PropTypes.string.def('plus'),
    params: PropTypes.object.def(),
    to: {
      required: true,
      type: String,
      default: null
    }
  },
  data () {
    return {
      query: this.params
    }
  },
  watch: {
    params (val, oldVal) {
      this.query = val
    }
  },
  methods: {
    onClick () {
      openView(this.$router, this.to, this.tabName, this.query)
    }
  }
}
</script>
