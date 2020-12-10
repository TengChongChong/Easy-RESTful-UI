<template>
  <span>
    <a-popconfirm
      title="确定要删除吗?"
      @confirm="() => remove()"
    >
      <a-tooltip placement="top">
        <template slot="title">
          <span>{{ name }}</span>
        </template>
        <a-button type="danger" size="small" :icon="icon"/>
      </a-tooltip>
    </a-popconfirm>
    <a-divider v-if="divider" type="vertical" />
  </span>
</template>
<script>
  export default {
    name: 'BtnRemove',
    props: {
      name: {
        type: String,
        default: '删除'
      },
      icon: {
        type: String,
        default: 'delete'
      },
      id: {
        type: String,
        default: null
      },
      params: {
        type: Object,
        default: null
      },
      divider: {
        type: Boolean,
        default: true
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
      remove () {
        this.onClick(this.id, this.params)
      }
    }
  }
</script>
