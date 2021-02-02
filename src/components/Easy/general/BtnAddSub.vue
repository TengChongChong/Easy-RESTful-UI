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
  name: 'EBtnAddSub',
  props: {
    permissions: PropTypes.string.def(),
    name: PropTypes.string.def('新增下级'),
    tabName: PropTypes.string.def('新增下级'),
    icon: PropTypes.string.def('plus'),
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
      openView(this.$router, this.to, this.tabName, this.query)
    }
  }
}
</script>
