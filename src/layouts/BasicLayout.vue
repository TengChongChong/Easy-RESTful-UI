<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :menuRender="menuRender"
    :i18nRender="i18nRender"
    v-bind="settings"
  >
    <template v-slot:menuHeaderRender>
      <div>
        <logo-svg />
        <h1>{{ title }}</h1>
      </div>
    </template>

    <setting-drawer ref="settingDrawer" :settings="settings" @change="handleSettingChange" />
    <template v-slot:headerContentRender>
      <header-split-menu ref="headerSplitMenu" v-if="!isMobile && settings.layout !== 'topmenu'" :settings="settings"/>
    </template>

    <template v-slot:rightContentRender>
      <right-content
        :set-setting-drawer-show="setSettingDrawerShow"
        :settings="settings"
        :top-menu="settings.layout === 'topmenu'"
        :is-mobile="isMobile"
        :theme="settings.theme" />
    </template>
    <template v-slot:footerRender>
      <global-footer />
    </template>
    <multi-tab :sidebar-collapsed="collapsed"/>
    <router-view />
  </pro-layout>
</template>

<script>
import { updateTheme } from '@ant-design-vue/pro-layout'
import SettingDrawer from '@/components/SettingDrawer'
import { i18nRender } from '@/locales'
import { mapState } from 'vuex'
import { CONTENT_WIDTH_TYPE, SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'

import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import Ads from '@/components/Other/CarbonAds'
import LogoSvg from '@/assets/logo.svg?inline'
import BaseMenu from '@/components/RouteMenu'
import { isNotBlank } from '@/utils/util'
import HeaderSplitMenu from '@/components/GlobalHeader/HeaderSplitMenu'
import storage from 'store'
export default {
  name: 'BasicLayout',
  components: {
    HeaderSplitMenu,
    SettingDrawer,
    RightContent,
    GlobalFooter,
    LogoSvg,
    Ads,
    BaseMenu
  },
  data () {
    return {
      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
      title: defaultSettings.title,
      // 用户设置
      userSettings: {},
      settings: {},
      // 媒体查询
      query: {},
      // 是否手机模式
      isMobile: false
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.menu,
      multiTab: (state) => state.app.multiTab
    }),
    currentTopMenu () {
      return this.$store.state.menu.currentTopMenu
    }
  },
  created () {
    // 处理侧栏收起状态
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
      this.$refs.headerSplitMenu && this.$refs.headerSplitMenu.setFirstLevelMenu()
    })
    this.userSettings = storage.get('userSettings') || {}
    this.initSetting()
  },
  mounted () {
    this.setMenu()

    // this.$refs.settingDrawer.setShow(true)
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }

    // first update color
    // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
    // if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
      updateTheme(this.settings.primaryColor)
    // }
  },
  watch: {
    currentTopMenu (newVal) {
      this.setMenu(newVal)
    }
  },
  methods: {
    initSetting () {
      this.settings = {
        // 布局类型
        layout: this.userSettings.layout || defaultSettings.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth: this.userSettings.contentWidth || defaultSettings.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: this.userSettings.theme || defaultSettings.navTheme,
        // 主色调
        primaryColor: this.userSettings.primaryColor || defaultSettings.primaryColor,
        fixedHeader: this.userSettings.fixedHeader || defaultSettings.fixedHeader,
        fixSiderbar: this.userSettings.fixSiderbar || defaultSettings.fixSiderbar,
        colorWeak: this.userSettings.colorWeak || defaultSettings.colorWeak,
        splitMenu: this.userSettings.splitMenu || defaultSettings.splitMenu,
        hideHintAlert: false,
        hideCopyButton: false
      }
    },
    setMenu (currentTopMenu) {
      const routes = this.mainMenu.menus.find(item => item.path === '/')
      this.menus = (routes && routes.children) || []
      if (isNotBlank(currentTopMenu) && this.settings.splitMenu && this.settings.layout === 'sidemenu' && !this.isMobile) {
        this.menus = this.menus.find(item => item.path === currentTopMenu).children || []
      }
    },
    menuRender (h, { collapsed, menus, mode, theme, i18nRender }) {
      return (
        <BaseMenu collapsed={collapsed} settings={this.settings} menus={menus} mode={mode} theme={theme} i18nRender={i18nRender} />
      )
    },
    i18nRender,
    handleMediaQuery (val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse (val) {
      this.collapsed = val
    },
    handleSettingChange ({ type, value }) {
      type && (this.settings[type] = value)
      storage.set('userSettings', this.settings)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value
          break
        case 'layout':
          this.setMenu(this.currentTopMenu)
          if (value === 'sidemenu') {
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
          }
          break
        case 'splitMenu':
          this.setMenu(this.currentTopMenu)
      }
      this.$refs.headerSplitMenu && this.$refs.headerSplitMenu.setFirstLevelMenu()
    },
    setSettingDrawerShow (show) {
      this.$refs.settingDrawer.setShow(show)
    }
  }
}
</script>

<style lang="less">
@import "./BasicLayout.less";
</style>
