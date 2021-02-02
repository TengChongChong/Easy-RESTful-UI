<template>
  <span v-if="permissions == null || permissions === '' || $permissions(permissions)">
    <a-tooltip placement="top">
      <template slot="title">
        <span>{{ name }}</span>
      </template>
      <a-button type="primary" size="small" :icon="icon" @click="onClick"/>
    </a-tooltip>
    <a-divider v-if="divider" type="vertical"/>
  </span>
</template>
<script>
import { openView } from '@/utils/util'
import PropTypes from 'ant-design-vue/es/_util/vue-types'

export default {
  name: 'EBtnInfo',
  props: {
    permissions: PropTypes.string.def(),
    name: PropTypes.string.def('详情'),
    tabName: PropTypes.string.def('详情'),
    icon: PropTypes.string.def('search'),
    id: PropTypes.string.def(),
    params: PropTypes.object.def(),
    divider: PropTypes.bool.def(true),
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
      this.query = Object.assign((this.query || {}), { id: this.id })
      openView(this.$router, this.to, this.tabName, this.query)
    }
  }
}
</script>
