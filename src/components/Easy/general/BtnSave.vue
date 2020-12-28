<template>
  <a-button type="primary" :icon="icon" @click="save">
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
    }
  },
  methods: {
    save () {
      this.clickCallback()
    }
  }
}
</script>
