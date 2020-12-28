<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form-model
        :label-col="formLayout.labelCol"
        :wrapper-col="formLayout.wrapperCol">
        <a-card :bordered="false">
          <a-row :gutter="24">
            <slot name="query"></slot>
            <a-col :xxl="6" :xl="8" :lg="12" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="currentAdvanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" icon="search" @click="refresh()">查询</a-button>
                <a-button icon="undo" style="margin-left: 8px" @click="reset()">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ currentAdvanced ? '收起' : '展开' }}
                  <a-icon :type="currentAdvanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-card>
      </a-form-model>
    </div>

    <a-card class="card-table" :bordered="false">
      <div class="card-table-header">
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
      </div>
      <div class="card-table-content">
        <slot name="table"></slot>
      </div>
    </a-card>
  </div>
</template>
<script>
import { FORM_LAYOUT } from '@/utils/const/form'

export default {
  name: 'EProTable',
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
      formLayout: FORM_LAYOUT,
      currentAdvanced: this.advanced,
      currentSize: null
    }
  },
  mounted () {
    this.currentSize = this.getTableNode().currentSize
  },
  methods: {
    /**
     * 在父节点中查找table
     */
    getTableNode () {
      let $parent = this.$parent
      while (!$parent.$refs.table && $parent.$parent) {
        $parent = $parent.$parent
      }
      if (!$parent) {
        console.error('获取table失败')
      }
      return $parent.$refs.table
    },
    /**
     * 查询
     */
    refresh () {
      this.getTableNode().refresh(true)
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
      this.getTableNode().setSize(this.currentSize)
    }
  }
}
</script>
<style lang="less">
.card-table {
  .card-table-header {
    .table-list-toolbar {
      overflow-x: auto;
      overflow-y: hidden;

      .table-list-toolbar-container {
        display: flex;
        justify-content: space-between;
        height: 64px;
        padding: 0 24px;
        line-height: 64px;

        .table-list-toolbar-left {
          display: flex;
          justify-content: flex-start;

          .table-list-toolbar-title {
            color: rgba(0, 0, 0, .85);
            font-size: 16px;
            font-weight: 500;
          }
        }

        .table-list-toolbar-right {
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .ant-btn {
            margin-right: 5px;
          }

          .toolbar-item {
            border: 0;
            box-shadow: none;
            margin: 0;
          }
        }
      }
    }
  }

  .card-table-content {
    padding: 0 20px 20px 20px;
  }

  .ant-card-body {
    padding: 0;
  }

  .table-alert {
    margin-bottom: 16px;
  }
}
</style>
