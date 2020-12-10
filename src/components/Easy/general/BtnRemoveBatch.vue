<template>
  <a-button v-if="ids.length > 0" type="danger" :icon="icon" @click="showConfirm">{{ name }}</a-button>
</template>
<script>
  export default {
    name: 'BtnRemoveBatch',
    props: {
      name: {
        type: String,
        default: '删除'
      },
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
      onClick: {
        type: Function,
        require: true,
        default: () => {}
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
      showConfirm () {
        const self = this
        this.$confirm({
          title: '确定要删除选中 ' + this.ids.length + ' 条数据吗?',
          content: h => <div style="color:#ff4d4f;">删除后无法恢复，请谨慎操作</div>,
          onOk () {
            self.onClick(self.ids.join(','), self.params)
          }
        })
      }
    }
  }
</script>
