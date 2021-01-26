<template>
  <div>
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta
          :description="`${item.nickname} ${fromNow(item.sendDate)}`"
        >
          <a
            slot="title"
            :class="item.readDate == null ? 'unread' : ''"
            type="link"
            @click="info(item.id, item.messageId)">{{ item.title }}</a>
          <template slot="avatar">
            <e-avatar :avatar="item.avatar" :nickname="item.nickname"/>
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
import EAvatar from '@/components/Easy/data-display/Avatar'

export default {
  name: 'EMessageList',
  props: {
    status: {
      type: String,
      default: null
    },
    size: {
      type: Number,
      default: 5
    }
  },
  components: {
    EAvatar,
    Info
  },
  data () {
    return {
      MESSAGE_CONST: MESSAGE_CONST,

      data: [],

      messageModalVisible: false,
      id: null,
      messageId: null
    }
  },
  activated () {
    this.loadData()
  },
  mounted () {
    this.loadData()
  },
  methods: {
    // 加载数据方法 必须为 Promise 对象
    loadData () {
      return selectReceive({
        detailsStatus: this.status,
        size: this.size
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
