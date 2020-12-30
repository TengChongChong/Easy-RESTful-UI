<template>
  <div class="page-header-index-wide">
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
      <div class="view-info-main" :class="{ 'mobile': isMobile }">
        <div class="view-info-left">
          <a-menu
            :mode="isMobile ? 'horizontal' : 'inline'"
            :style="{ border: '0', width: isMobile ? '560px' : 'auto'}"
            type="inner"
            :selected-keys="selectedKeys"
            @click="handleClick"
          >
            <a-menu-item key="input">
              <a-icon type="edit" />
              写消息
            </a-menu-item>
            <a-menu-item key="receive">
              <a-icon type="mail" />
              收信箱
            </a-menu-item>
            <a-menu-item key="draft">
              <a-icon type="container" />
              草稿箱
            </a-menu-item>
            <a-menu-item key="sent">
              <a-icon type="check-circle" />
              已发送
            </a-menu-item>
            <a-menu-item key="star">
              <a-icon type="star" />
              标星消息
            </a-menu-item>
            <a-menu-item key="recycle-bin">
              <a-icon type="delete" />
              回收站
            </a-menu-item>
          </a-menu>
        </div>
        <div class="view-info-right">
          <receive :set-id="setId" :set-message-id="setMessageId" :set-current-menu="setCurrentMenu" v-if="'receive' === currentMenu"/>
          <m-input :id="id" v-if="'input' === currentMenu"/>
          <m-info :id="id" :message-id="messageId" v-if="'info' === currentMenu"/>
          <draft :set-id="setId" :set-current-menu="setCurrentMenu" v-if="'draft' === currentMenu"/>
          <sent :set-message-id="setMessageId" :set-current-menu="setCurrentMenu" v-if="'sent' === currentMenu"/>
          <receive :star="MESSAGE_CONST.STAR_YES" :set-id="setId" :set-message-id="setMessageId" :set-current-menu="setCurrentMenu" v-if="'star' === currentMenu"/>
          <receive :status="MESSAGE_CONST.RECEIVE_STATUS_DELETED" :set-id="setId" :set-message-id="setMessageId" :set-current-menu="setCurrentMenu" v-if="'recycle-bin' === currentMenu"/>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import Receive from '@/views/sys/message/Receive'
import MInput from '@/views/sys/message/Input'
import MInfo from '@/views/sys/message/Info'
import Draft from '@/views/sys/message/Draft'
import Sent from '@/views/sys/message/Sent'
import { MESSAGE_CONST } from '@/utils/const/sys/MessageConst'

export default {
  name: 'SysMessageView',
  components: {
    MInput,
    MInfo,
    Receive,
    Draft,
    Sent
  },
  mixins: [baseMixin],
  data () {
    return {
      MESSAGE_CONST: MESSAGE_CONST,
      currentMenu: 'receive',
      selectedKeys: [],

      // 修改&查看
      id: null,
      messageId: null
    }
  },
  mounted () {
    this.setSelectedKeys(this.currentMenu)
  },
  methods: {
    handleClick (e) {
      this.currentMenu = e.key
      this.setSelectedKeys(this.currentMenu)
    },
    setCurrentMenu (currentMenu) {
      this.currentMenu = currentMenu
      this.setSelectedKeys(currentMenu)
    },
    setId (id) {
      this.id = id
    },
    setMessageId (messageId) {
      this.messageId = messageId
    },
    /**
     * 设置选中菜单
     *
     * @param selectedKey key
     */
    setSelectedKeys (selectedKey) {
      this.selectedKeys = [selectedKey]
      this.id = null
      this.messageId = null
    }
  }
}
</script>

<style lang="less" scoped>
  .view-info-main {
    width: 100%;
    display: flex;
    height: 100%;
    overflow: auto;

    &.mobile {
      display: block;

      .view-info-left {
        border-right: unset;
        border-bottom: 1px solid #e8e8e8;
        width: 100%;
        height: 50px;
        overflow-x: auto;
        overflow-y: scroll;
      }
      .view-info-right {
        padding: 20px;
      }
    }

    .view-info-left {
      border-right: 1px solid #e8e8e8;
      width: 224px;
    }

    .view-info-right {
      flex: 1 1;
      padding: 8px 20px;

      .view-info-title {
        color: rgba(0,0,0,.85);
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        margin-bottom: 12px;
      }
      .view-info-view {
        padding-top: 12px;
      }
    }
  }

</style>
