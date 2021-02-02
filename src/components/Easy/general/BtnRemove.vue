<template>
  <span v-if="permissions == null || permissions === '' || $permissions(permissions)">
    <a-popconfirm
      title="确定要删除吗?"
      @confirm="() => remove()"
    >
      <a-tooltip placement="top">
        <template slot="title">
          <span>{{ name }}</span>
        </template>
        <a-button type="danger" size="small" :loading="loading" :icon="icon"/>
      </a-tooltip>
    </a-popconfirm>
    <a-divider v-if="divider" type="vertical"/>
  </span>
</template>
<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'

export default {
  name: 'EBtnRemove',
  props: {
    permissions: PropTypes.string.def(),
    name: PropTypes.string.def('删除'),
    icon: PropTypes.string.def('delete'),
    id: PropTypes.string.def(),
    params: PropTypes.object.def(),
    divider: PropTypes.bool.def(true),
    clickCallback: {
      type: Function,
      require: true,
      default: () => {
      }
    }
  },
  data () {
    return {
      loading: false,
      query: this.params
    }
  },
  watch: {
    params (val, oldVal) {
      this.query = val
    }
  },
  methods: {
    remove () {
      this.loading = true
      this.clickCallback(this.id, this.params)
    }
  }
}
</script>
