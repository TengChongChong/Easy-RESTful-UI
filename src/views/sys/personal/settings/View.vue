<template>
  <div class="page-header-index-wide">
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
      <div class="account-settings-info-main" :class="{ 'mobile': isMobile }">
        <div class="account-settings-info-left">
          <a-menu
            :mode="isMobile ? 'horizontal' : 'inline'"
            :style="{ border: '0', width: isMobile ? '560px' : 'auto'}"
            type="inner"
            :default-selected-keys="[currentMenu]"
            @click="handleClick"
          >
            <a-menu-item key="base-setting">
              <a-icon type="profile" />
              基本设置
            </a-menu-item>
            <a-menu-item key="security">
              <a-icon type="safety" />
              安全设置
            </a-menu-item>
            <a-menu-item key="custom">
              <a-icon type="skin" />
              个性化
            </a-menu-item>
            <a-menu-item key="binding">
              <a-icon type="link" />
              账户绑定
            </a-menu-item>
          </a-menu>
        </div>
        <div class="account-settings-info-right">
          <base-setting v-if="currentMenu === 'base-setting'"/>
          <security v-if="currentMenu === 'security'"/>
          <custom v-if="currentMenu === 'custom'"/>
          <binding v-if="currentMenu === 'binding'"/>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import BaseSetting from '@/views/sys/personal/settings/BaseSetting'
import Security from '@/views/sys/personal/settings/Security'
import Custom from '@/views/sys/personal/settings/Custom'
import Binding from '@/views/sys/personal/settings/Binding'

export default {
  name: 'SysPersonalSettingsView',
  components: {
    BaseSetting,
    Security,
    Custom,
    Binding
  },
  mixins: [baseMixin],
  data () {
    return {
      currentMenu: 'base-setting'
    }
  },
  methods: {
    handleClick (e) {
      this.currentMenu = e.key
    }
  }
}
</script>

<style lang="less" scoped>
  .account-settings-info-main {
    width: 100%;
    display: flex;
    height: 100%;
    overflow: auto;

    &.mobile {
      display: block;

      .account-settings-info-left {
        border-right: unset;
        border-bottom: 1px solid #e8e8e8;
        width: 100%;
        height: 50px;
        overflow-x: auto;
        overflow-y: scroll;
      }
      .account-settings-info-right {
        padding: 20px 40px;
      }
    }

    .account-settings-info-left {
      border-right: 1px solid #e8e8e8;
      width: 224px;
    }

    .account-settings-info-right {
      flex: 1 1;
      padding: 8px 40px;

      .account-settings-info-title {
        color: rgba(0,0,0,.85);
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        margin-bottom: 12px;
      }
      .account-settings-info-view {
        padding-top: 12px;
      }
    }
  }

</style>
