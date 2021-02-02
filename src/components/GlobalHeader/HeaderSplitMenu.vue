<template>
  <div class="ant-pro-global-header-split-menu">
    <a-menu v-model="currentMenu" mode="horizontal" @click="onTopMenuClick">
      <a-menu-item v-show="!menu.hidden" v-for="menu in firstLevelMenu" :key="menu.path">
        <a-icon :type="menu.meta.icon"/>
        {{ menu.meta.title }}
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import { openView } from '@/utils/util'

export default {
  name: 'HeaderSplitMenu',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-split-menu'
    },
    settings: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      currentMenu: [],
      firstLevelMenu: []
    }
  },
  mounted () {
    this.setFirstLevelMenu()
  },
  computed: {
    ...mapGetters(['menu', 'currentTopMenu'])
  },
  methods: {
    setFirstLevelMenu () {
      if (this.settings.splitMenu && this.settings.layout === 'sidemenu') {
        const routes = this.menu.find(item => item.path === '/')
        this.firstLevelMenu = (routes && routes.children) || []
        if (this.currentTopMenu) {
          this.currentMenu = [this.currentTopMenu]
        } else {
          this.firstLevelMenu.map(item => {
            if (!this.currentMenu.length && !item.hidden) {
              this.currentMenu = [item.path]
            }
          })
          if (this.currentMenu.length > 0) {
            store.dispatch('setCurrentTopMenu', this.currentMenu[0])
          }
        }
      } else {
        store.dispatch('setCurrentTopMenu', null)
        this.firstLevelMenu = []
      }
    },
    onTopMenuClick ({ key }) {
      const currentMenu = this.firstLevelMenu.find(item => item.path === key)
      if (!currentMenu.children) {
        openView(this.$router, currentMenu.path, currentMenu.meta.title)
      }
      store.dispatch('setCurrentTopMenu', key)
    }
  }
}
</script>

<style scoped>

</style>
