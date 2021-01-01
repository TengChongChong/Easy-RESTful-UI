<template>
  <div>
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta
          :description="`${item.nickname} ${fromNow(item.sendDate)}`"
        >
          <a slot="title" :class="item.readDate == null ? 'unread' : ''" type="link" @click="info(item.id, item.messageId)">{{ item.title }}</a>
          <template slot="avatar">
            <a-avatar v-if="item.avatar != null && item.avatar !== ''" :src="VUE_APP_API_BASE_URL + item.avatar"/>
            <a-avatar v-else>
              {{ item.nickname.substr(0, 1) }}
            </a-avatar>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>

    <a-modal v-model="messageModalVisible" title="消息详情">
      <info :id="id" :message-id="messageId"/>
      <template slot="footer">
        <a-button key="back" @click="close">
          关闭
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { selectReceive } from '@/api/sys/message'
import { MESSAGE_CONST } from '@/utils/const/sys/MessageConst'
import { fromNow } from '@/utils/util'
import Info from '@/views/sys/message/Info'

export default {
  props: {
    status: {
      type: String,
      default: null
    }
  },
  components: {
    Info
  },
  data () {
    return {
      MESSAGE_CONST: MESSAGE_CONST,
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,

      data: [],

      messageModalVisible: false,
      id: null,
      messageId: null
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    // 加载数据方法 必须为 Promise 对象
    loadData () {
      return selectReceive({
        detailsStatus: this.status
      })
        .then(res => {
          this.data = res.data.data
        })
    },
    fromNow (time) {
      return fromNow(time)
    },
    info (id, messageId) {
      this.id = id
      this.messageId = messageId
      this.messageModalVisible = true
    },
    close () {
      this.refresh()
      this.messageModalVisible = false
    },
    refresh () {
      this.loadData()
    }
  }
}
</script>
