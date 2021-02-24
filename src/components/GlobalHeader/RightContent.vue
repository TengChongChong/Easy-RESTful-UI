<template>
  <div :class="wrpCls">
    <span class="fullscreen-btn" :class="prefixCls" @click="onFullScreenClick">
      <a-tooltip :title="isFullscreen ? '取消全屏' : '全屏'">
        <a-icon :type="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"/>
      </a-tooltip>
    </span>
    <message-dropdown :class="prefixCls"/>
    <avatar-dropdown :menu="showMenu" :current-user="user" :class="prefixCls"/>
    <a-tooltip title="偏好设置">
      <span :class="prefixCls" @click="setSettingDrawerShow(true)">
        <a-icon type="setting"/>
      </span>
    </a-tooltip>
    <select-lang :class="prefixCls"/>
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import { mapGetters } from 'vuex'
import MessageDropdown from '@/components/GlobalHeader/MessageDropdown'
import { exitFullscreen, launchFullScreen } from '@/utils/util'

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
    onFullScreenClick () {
      this.isfullscreen ? exitFullscreen() : launchFullScreen()
      this.isfullscreen = !this.isfullscreen
    }
  }
}
</script>
