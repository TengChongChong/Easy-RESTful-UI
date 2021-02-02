<template>
  <a-button
    v-if="permissions == null || permissions === '' || $permissions(permissions)"
    type="primary"
    :icon="icon"
    :loading="btnLoading"
    @click="save">
    <slot>保存</slot>
  </a-button>
</template>
<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'

export default {
  name: 'EBtnSave',
  props: {
    permissions: PropTypes.string.def(),
    icon: PropTypes.string.def('save'),
    clickCallback: PropTypes.func.def(),
    loading: PropTypes.bool.def(false)
  },
  watch: {
    loading (val, oldVal) {
      this.btnLoading = val
    }
  },
  data () {
    return {
      btnLoading: this.loading
    }
  },
  methods: {
    save () {
      this.$emit('update:loading', this.btnLoading)
      this.clickCallback()
    }
  }
}
</script>
