<template>
  <div :class="wrpCls">
    <div v-show="!isMobile && !topMenu" class="ant-pro-global-header-top-menu">
      <a-menu v-model="currentMenu" mode="horizontal" @click="onTopMenuClick">
        <a-menu-item v-show="!menu.hidden" v-for="menu in firstLevelMenu" :key="menu.path">
          <a-icon :type="menu.meta.icon"/>
          {{ menu.meta.title }}
        </a-menu-item>
      </a-menu>
    </div>
    <div class="ant-pro-global-header-top-bar">
      <message-dropdown :class="prefixCls"/>
      <avatar-dropdown :menu="showMenu" :current-user="user" :class="prefixCls"/>
      <span :class="prefixCls" @click="setSettingDrawerShow(true)">
        <a-tooltip title="偏好设置">
          <a class="header-icon-btn" target="_blank">
            <a-icon type="setting"/>
          </a>
        </a-tooltip>
      </span>
      <select-lang :class="prefixCls"/>
    </div>
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import { mapGetters } from 'vuex'
import MessageDropdown from '@/components/GlobalHeader/MessageDropdown'
import { openView } from '@/utils/util'
import store from '@/store'

export default {
  name: 'RightContent',
  components: {
    MessageDropdown,
    AvatarDropdown,
    SelectLang
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    settings: {
      type: Object,
      required: true
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    },
    setSettingDrawerShow: {
      type: Function,
      default: () => {
      }
    }
  },
  data () {
    return {
      currentMenu: [],
      firstLevelMenu: [],
      showMenu: true
    }
  },
  mounted () {
    this.setFirstLevelMenu()
  },
  computed: {
    ...mapGetters(['user', 'menu', 'currentTopMenu']),
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  },
  methods: {
    setFirstLevelMenu () {
      if (this.settings.splitMenu && this.settings.layout === 'sidemenu' && !this.isMobile) {
        const routes = this.menu.find(item => item.path === '/')
        this.firstLevelMenu = (routes && routes.children) || []
        console.log('this.firstLevelMenu', this.firstLevelMenu)
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
      }
    },
    onTopMenuClick ({ item, key, keyPath }) {
      const currentMenu = this.firstLevelMenu.find(item => item.path === key)
      if (!currentMenu.children) {
        openView(this.$router, currentMenu.path, currentMenu.meta.title)
      }
      store.dispatch('setCurrentTopMenu', key)
    }
  }
}
</script>
<style>
.header-icon-btn {
  font-size: 16px;
  color: hsla(0, 0%, 100%, 0.85)
}
</style>
