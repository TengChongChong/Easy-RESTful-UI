<template>
  <div>
    <h2 class="title">{{ model.title }}</h2>
    <p>
      <a-avatar v-if="model.avatar != null && model.avatar !== ''" :src="VUE_APP_API_BASE_URL + model.avatar"/>
      <a-avatar v-else>
        {{ model.nickname && model.nickname.substr(0, 1) }}
      </a-avatar>
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

export default {
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
      })
    }
  },
  computed: {
    sendDate () {
      return formatDate(this.model.sendDate)
    }
  }
}
</script>
<style>
.title {
  text-align: center;
}
</style>
