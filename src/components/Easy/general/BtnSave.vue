<template>
  <a-button type="primary" :icon="icon" :loading="btnLoading" @click="save">
    <slot>保存</slot>
  </a-button>
</template>
<script>
export default {
  name: 'EBtnSave',
  props: {
    icon: {
      type: String,
      default: 'save'
    },
    clickCallback: {
      type: Function,
      require: true,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
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
