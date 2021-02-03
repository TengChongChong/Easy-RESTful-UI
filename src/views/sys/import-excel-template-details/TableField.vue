<template>
  <a-select
    style="width: 100%"
    show-search
    :disabled="disabled"
    option-filter-prop="children"
    v-model="currentValue"
    @change="handleChange"
  >
    <a-select-option v-for="item in fields" :key="item.columnName">
      {{ item.columnName }} - {{ item.comment }}
    </a-select-option>
  </a-select>
</template>
<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { selectFields } from '@/api/generator'

export default {
  name: 'ETableField',
  props: {
    table: PropTypes.string.def(),
    value: PropTypes.string.def(),
    disabled: PropTypes.bool.def(false)
  },
  data () {
    return {
      fields: {},
      currentValue: this.value
    }
  },
  watch: {
    table () {
      this.selectFields()
    },
    value (newValue) {
      this.currentValue = newValue
    }
  },
  created () {
    if (this.table) {
      this.selectFields()
    }
  },
  methods: {
    selectFields () {
      if (this.table) {
        selectFields(this.table).then(({ data }) => {
          this.fields = data.fields
        })
      } else {
        this.fields = []
      }
    },
    handleChange () {
      this.$emit('input', this.currentValue)
    }
  }
}
</script>
<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
