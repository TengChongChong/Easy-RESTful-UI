<template>
  <a-button
    v-if="permissions == null || permissions === '' || $permissions(permissions)"
    type="primary"
    :icon="icon"
    @click="onClick">
    <slot>导入</slot>
  </a-button>
</template>
<script>
import { openView } from '@/utils/util'
import PropTypes from 'ant-design-vue/es/_util/vue-types'

export default {
  name: 'EBtnImport',
  props: {
    permissions: PropTypes.string.def(),
    tabName: PropTypes.string.def('导入数据'),
    icon: PropTypes.string.def('upload'),
    params: PropTypes.object.def(),
    importCode: {
      required: true,
      type: String
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
      openView(this.$router, `/sys/import-excel-data/input?importCode=${this.importCode}`, this.tabName, this.query)
    }
  }
}
</script>
