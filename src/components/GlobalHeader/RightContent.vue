<template>
  <div :class="wrpCls">
    <message-dropdown :class="prefixCls"/>
    <avatar-dropdown :menu="showMenu" :current-user="user" :class="prefixCls" />
    <a class="header-icon-btn" :class="prefixCls" target="_blank" href="http://www.easy-frame.top/">
      <a-tooltip title="使用文档">
        <a-icon type="question-circle" />
      </a-tooltip>
    </a>
    <span :class="prefixCls" @click="setSettingDrawerShow(true)">
      <a-tooltip title="偏好设置">
        <a class="header-icon-btn" target="_blank">
          <a-icon type="setting" />
        </a>
      </a-tooltip>
    </span>
    <select-lang :class="prefixCls" />
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
      default: () => {}
    }
  },
  data () {
    return {
      showMenu: true
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
  }
}
</script>
<style>
  .header-icon-btn {
    font-size: 16px;
    color: hsla(0, 0%, 100%, 0.85)
  }
</style>
