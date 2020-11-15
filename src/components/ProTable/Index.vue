<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-card :bordered="false">
          <a-row :gutter="48">
            <slot name="query"></slot>
            <a-col :xl="6" :lg="8" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="currentAdvanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="refresh()">查询</a-button>
                <a-button style="margin-left: 8px" @click="reset()">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ currentAdvanced ? '收起' : '展开' }}
                  <a-icon :type="currentAdvanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
    </div>

    <a-card class="card-table" :bordered="false">
      <div class="table-list-toolbar">
        <div class="table-list-toolbar-container">
          <div class="table-list-toolbar-left">
            <div class="table-list-toolbar-title">{{ title }}</div>
          </div>
          <div class="table-list-toolbar-right">
            <slot name="button"></slot>
            <a-divider type="vertical"/>
            <a-tooltip placement="top">
              <template slot="title">
                <span>刷新</span>
              </template>
              <a-button class="toolbar-item" icon="reload" @click="refresh()"/>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title">
                <span>密度</span>
              </template>
              <a-dropdown :trigger="['click']">
                <a-menu slot="overlay" @click="handleSizeClick" :selected-keys="[this.currentSize]">
                  <a-menu-item key="default"> 默认</a-menu-item>
                  <a-menu-item key="middle"> 中等</a-menu-item>
                  <a-menu-item key="small"> 紧凑</a-menu-item>
                </a-menu>
                <a-button class="toolbar-item">
                  <a-icon type="column-height"/>
                </a-button>
              </a-dropdown>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title">
                <span>列设置（未实现）</span>
              </template>
              <a-button class="toolbar-item" icon="setting"/>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title">
                <span>全屏（未实现）</span>
              </template>
              <a-button class="toolbar-item" icon="fullscreen"/>
            </a-tooltip>
          </div>
        </div>
      </div>
      <slot name="table"></slot>
    </a-card>
  </div>
</template>
<script>
  export default {
    name: 'ProTable',
    props: {
      title: {
        type: String,
        default: ''
      },
      advanced: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentAdvanced: this.advanced,
        currentSize: null
      }
    },
    mounted () {
      this.currentSize = this.$parent.$refs.table.currentSize
    },
    methods: {
      /**
       * 查询
       */
      refresh () {
        this.$parent.$refs.table.refresh(true)
      },
      /**
       * 重置
       */
      reset () {
        this.$parent.queryParam = {}
        this.refresh()
      },
      /**
       * 切换高级查询
       */
      toggleAdvanced () {
        this.currentAdvanced = !this.currentAdvanced
        this.$emit('update:advanced', this.currentAdvanced)
      },
      /**
       * 切换密度
       *
       * @param select 密度
       */
      handleSizeClick (select) {
        this.currentSize = select.key
        this.$parent.$refs.table.setSize(this.currentSize)
      }
    }
  }
</script>
