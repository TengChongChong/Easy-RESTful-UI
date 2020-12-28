<template>
  <span>
    <a-tooltip placement="top">
      <template slot="title">
        <span>{{ name }}</span>
      </template>
      <a-button type="primary" size="small" :icon="icon" @click="onClick"/>
    </a-tooltip>
    <a-divider v-if="divider" type="vertical" />
  </span>
</template>
<script>
  import { openView } from '@/utils/util'

  export default {
    name: 'EBtnAddSub',
    props: {
      name: {
        type: String,
        default: '新增下级'
      },
      tabName: {
        type: String,
        default: '新增下级'
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
      },
      divider: {
        type: Boolean,
        default: true
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
