<template>
  <a-button
    v-if="(permissions == null || permissions === '' || $permissions(permissions)) && ids && ids.length > 0"
    type="danger"
    :loading="btnLoading"
    :icon="icon"
    @click="showConfirm">
    <slot>删除</slot>
  </a-button>
</template>
<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'

export default {
  name: 'EBtnRemoveBatch',
  props: {
    permissions: PropTypes.string.def(),
    icon: PropTypes.string.def('delete'),
    ids: PropTypes.array.def(),
    params: PropTypes.object.def(),
    clickCallback: {
      type: Function,
      require: true,
      default: () => {}
    },
    loading: PropTypes.bool.def(false)
  },
  data () {
    return {
      query: this.params,
      btnLoading: this.loading
    }
  },
  watch: {
    params (val, oldVal) {
      this.query = val
    },
    loading (val, oldVal) {
      this.btnLoading = val
    }
  },
  methods: {
    showConfirm () {
      const self = this
      this.$confirm({
        title: '确定要删除选中 ' + this.ids.length + ' 条数据吗?',
        content: h => <div style="color:#ff4d4f;">删除后无法恢复，请谨慎操作</div>,
        onOk () {
          self.btnLoading = true
          self.$emit('update:loading', self.btnLoading)
          self.clickCallback(self.ids.join(','), self.params)
        }
      })
    }
  }
}
</script>
