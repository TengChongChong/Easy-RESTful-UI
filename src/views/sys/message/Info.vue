<template>
  <div>
    <h2 class="title">{{ model.title }}</h2>
    <p>
      <e-avatar :avatar="model.avatar" :nickname="model.nickname"/>
      {{ model.nickname }}
      <a-divider type="vertical" />
      {{ sendDate }}
    </p>
    <a-divider />
    <div v-html="model.content"></div>
  </div>
</template>

<script>
import { info } from '@/api/sys/message'
import { formatDate, isNotBlank } from '@/utils/util'
import { mapActions } from 'vuex'
import EAvatar from '@/components/Easy/data-display/Avatar'

export default {
  components: { EAvatar },
  props: {
    id: {
      type: String,
      default: null
    },
    messageId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
      model: {}
    }
  },
  mounted () {
    if (isNotBlank(this.messageId)) {
      info(this.id, this.messageId).then(res => {
        this.model = res.data
        this.SelectUnreadCount()
      })
    }
  },
  computed: {
    sendDate () {
      return formatDate(this.model.sendDate)
    }
  },
  methods: {
    ...mapActions(['SelectUnreadCount'])
  }
}
</script>
<style>
.title {
  text-align: center;
}
</style>
