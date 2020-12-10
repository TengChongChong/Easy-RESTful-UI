<template>
  <a-button type="primary" :icon="icon" @click="onClick">{{ name }}</a-button>
</template>
<script>
  import { openView } from '@/utils/util'

  export default {
    name: 'BtnAdd',
    props: {
      name: {
        type: String,
        default: '新增'
      },
      tabName: {
        type: String,
        default: '新增'
      },
      icon: {
        type: String,
        default: 'plus'
      },
      params: {
        type: Object,
        default: null
      },
      to: {
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
