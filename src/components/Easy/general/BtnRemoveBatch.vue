<template>
  <a-button v-if="ids && ids.length > 0" type="danger" :loading="btnLoading" :icon="icon" @click="showConfirm">
    <slot>删除</slot>
  </a-button>
</template>
<script>
  export default {
    name: 'EBtnRemoveBatch',
    props: {
      icon: {
        type: String,
        default: 'delete'
      },
      ids: {
        type: Array,
        default: null
      },
      params: {
        type: Object,
        default: null
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
