<template>
  <a-dropdown id="message-dropdown" class="message-dropdown" :trigger="['click']" :visible="messageDropdownVisible">
    <a-card
      id="message-dropdown-card"
      class="message-dropdown-card"
      slot="overlay"
      style="width: 340px"
      :tab-list="tabListNoTitle"
      :active-tab-key="key"
      @tabChange="(key) => {this.key = key}"
    >
      <div v-if="key === 'message'">
        <message-list ref="messageList" :status="MESSAGE_CONST.RECEIVE_STATUS_UNREAD"/>
        <div class="card-grid-wrapper">
          <a-card-grid style="width:50%;text-align:center" :hoverable="false">
            <router-link to="/sys/message">
              <a-button type="link">查看更多</a-button>
            </router-link>
          </a-card-grid>
          <a-card-grid style="width:50%;text-align:center" :hoverable="false">
            <a-button type="link" @click="setRead">标记已读</a-button>
          </a-card-grid>
        </div>
      </div>
      <div v-else-if="key === 'to-do'">

      </div>
    </a-card>
    <div :class="prefixCls" @click.stop="onMessageBtnClick">
      <a-badge :count="unreadCount" :offset="[2, -2]">
        <span> <a-icon type="mail"/> </span>
      </a-badge>
    </div>
  </a-dropdown>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import MessageList from '@/views/sys/message/MessageList'
import { setRead } from '@/api/sys/message-details'
import { MESSAGE_CONST } from '@/utils/const/sys/MessageConst'

export default {
  name: 'MessageDropdown',
  components: { MessageList },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    }
  },
  data () {
    return {
      MESSAGE_CONST: MESSAGE_CONST,
      timer: null,
      timeout: 1000 * 60 * 5,
      messageDropdownVisible: false,
      tabListNoTitle: [
        {
          key: 'message',
          tab: '消息'
        },
        {
          key: 'to-do',
          tab: '待办'
        }
      ],
      key: 'message',
      data: [
        {
          title: 'Ant Design Title 1'
        },
        {
          title: 'Ant Design Title 2'
        },
        {
          title: 'Ant Design Title 3'
        },
        {
          title: 'Ant Design Title 4'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['unreadCount'])
  },
  created () {
    this.SelectUnreadCount()
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.timer = setInterval(this.SelectUnreadCount, this.timeout)
    // 点击其他区域关闭
    document.querySelector('body').addEventListener('click', this.onBodyClick)
  },
  methods: {
    ...mapActions(['SelectUnreadCount']),
    onMessageBtnClick () {
      this.messageDropdownVisible = !this.messageDropdownVisible
    },
    onBodyClick (e) {
      if (this.messageDropdownVisible) {
        const messageDropdownCard = document.getElementById('message-dropdown-card')
        if (!messageDropdownCard.contains(e.target) && e.target.id !== 'message-dropdown') {
          this.messageDropdownVisible = false
        }
      }
    },
    setRead () {
      setRead().then(res => {
        this.SelectUnreadCount()
        this.$refs.messageList.refresh()
      })
    }
  },
  beforeDestroy () {
    document.querySelector('body').removeEventListener('click', this.onBodyClick)
  }
}
</script>

<style lang="less">
@import '~ant-design-vue/es/style/themes/default.less';

.message-dropdown {
  &.ant-badge {
    line-height: @layout-header-height;
  }
}

.message-dropdown-card {
  &.ant-dropdown-menu {
    padding-bottom: 0;
  }

  .ant-tabs {
    .ant-tabs-bar {
      margin-bottom: 0;
    }

    .ant-tabs-nav-scroll {
      text-align: center;
    }

    .ant-tabs-large-bar .ant-tabs-tab {
      padding: 10px 16px;
    }
  }

  .ant-list {
    .ant-list-item-meta {
      padding: 0 20px;
    }
  }

  .card-grid-wrapper {
    display: table;
    width: 100%;

    .ant-card-grid {
      padding: 5px 24px;
    }
  }
}

</style>
