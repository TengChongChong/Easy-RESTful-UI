<template>
  <div :class="wrpCls">
    <a class="fullscreen-btn" :class="prefixCls" @click="onFullscreenClick">
      <a-tooltip :title="isFullscreen ? '取消全屏' : '全屏'">
        <a-icon :type="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"/>
      </a-tooltip>
    </a>
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
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import { mapGetters } from 'vuex'
import MessageDropdown from '@/components/GlobalHeader/MessageDropdown'

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
      showMenu: true,
      isFullscreen: document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement
    }
  },
  computed: {
    ...mapGetters(['user']),
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  },
  methods: {
    /**
     * 全屏
     *
     * @param element {object} 要全屏的元素
     */
    launchFullScreen (element = document.documentElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    },

    /**
     * 退出全屏
     */
    exitFullscreen () {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },
    onFullscreenClick () {
      this.isFullscreen ? this.exitFullscreen() : this.launchFullScreen()
      this.isFullscreen = !this.isFullscreen
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
