<script>
import { isNotBlank } from '@/utils/util'

export default {
  name: 'MultiTab',
  props: {
    sidebarCollapsed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activeKey: ''
    }
  },
  methods: {
    /**
     * 查找路由
     *
     * @param fullPath {string} fullPath
     */
    findView (fullPath) {
      let viewLength = this.visitedViews.length
      while (viewLength--) {
        if (this.visitedViews[viewLength].fullPath === fullPath) {
          return this.visitedViews[viewLength]
        }
      }
      return null
    },
    /**
     * 为当前页面添加标签页
     */
    addTags () {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      this.activeKey = this.$route.fullPath
      return false
    },
    /**
     * 关闭标签页
     * @param view {{fullPath: string}}
     */
    closeSelectedTag (view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.activeKey === view.fullPath) {
          this.selectedLastPath()
        }
      })
    },
    /**
     * 标签页发生改变
     *
     * @param targetKey {string} fullPath
     * @param action {string} remove
     */
    onEdit (targetKey, action) {
      this[action](targetKey)
    },

    /**
     * 关闭标签页回调
     *
     * @param targetKey {string} fullPath
     */
    remove (targetKey) {
      this.closeSelectedTag(this.findView(targetKey))
    },
    /**
     * 选中最后一个标签页
     */
    selectedLastPath () {
      this.activeKey = this.visitedViews[this.visitedViews.length - 1].fullPath
    },

    // 右键菜单
    /**
     * 关闭当前标签页
     *
     * @param targetKey {string} fullPath
     */
    closeThat (targetKey) {
      this.closeSelectedTag({ fullPath: targetKey })
    },
    /**
     * 关闭其他标签页
     *
     * @param targetKey {string} fullPath
     */
    closeOther (targetKey) {
      this.$store.dispatch('tagsView/delOthersViews', { fullPath: targetKey }).then(() => {
        this.selectedLastPath()
      })
    },
    /**
     * 刷新当前标签页
     *
     * @param targetKey  {string} fullPath
     */
    refreshThat (targetKey) {
      this.$store.dispatch('tagsView/delCachedView', this.findView(targetKey)).then(() => {
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + targetKey
          })
        })
      })
    },
    closeMenuClick (key, route) {
      this[key](route)
    },
    renderTabPaneMenu (e) {
      return (
        <a-menu {...{ on: { click: ({ key, item, domEvent }) => { this.closeMenuClick(key, e) } } }}>
          <a-menu-item key="refreshThat"><a-icon type="sync" /> 刷新当前</a-menu-item>
          <a-menu-item key="closeThat"><a-icon type="close" /> 关闭当前</a-menu-item>
          <a-menu-item key="closeOther"><a-icon type="close" /> 关闭其他</a-menu-item>
        </a-menu>
      )
    },
    // render
    renderTabPane (title, keyPath) {
      const menu = this.renderTabPaneMenu(keyPath)

      return (
        <a-dropdown overlay={menu} trigger={['contextmenu']}>
          <span style={{ userSelect: 'none' }}>{ title }</span>
        </a-dropdown>
      )
    },
    getIcon (page) {
      if (page.meta.icon) return page.meta.icon
      let icon = null
      if (page.meta.icons && page.meta.icons.length) {
        page.meta.icons.map(item => {
          if (isNotBlank(item)) {
            icon = item
            return item
          }
        })
      }
      return icon || 'profile'
    }
  },
  watch: {
    '$route': function () {
      this.addTags()
    },
    activeKey: function (newPathKey) {
      this.$router.push({ path: newPathKey })
    }
  },
  computed: {
    visitedViews () {
      return this.$store.state.tagsView.visitedViews
    }
  },
  mounted () {
    this.addTags()
    this.selectedLastPath()
  },
  render () {
    const { onEdit } = this
    const panes = this.visitedViews.map(page => {
      return (
        <a-tab-pane
          style={{ height: 0 }}
          key={page.fullPath} closable={this.visitedViews.length > 1}
        >
          <template slot="tab">
            <a-icon type={this.getIcon(page)} />
            {this.renderTabPane(page.query.customTabName || page.meta.customTitle || page.meta.title, page.fullPath)}
          </template>
        </a-tab-pane>)
    })

    return (
      <div class={['ant-pro-multi-tab', this.sidebarCollapsed ? 'sidebar-collapsed' : '']}>
        <div class="ant-pro-multi-tab-wrapper">
          <a-tabs
            hideAdd
            type={'editable-card'}
            v-model={this.activeKey}
            tabBarStyle={{ background: '#FFF', margin: 0, paddingLeft: '16px' }}
            {...{ on: { edit: onEdit } }}>
            {panes}
          </a-tabs>
        </div>
      </div>
    )
  }
}
</script>
