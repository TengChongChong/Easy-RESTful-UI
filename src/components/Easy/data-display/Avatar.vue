<template>
  <a-avatar
    :size="size"
    v-if="avatar != null && avatar !== ''"
    :src="(relativePath ? VUE_APP_API_BASE_URL : '') + avatar"/>
  <a-avatar :size="size" v-else>
    {{ nickname && nickname.substr(0, 1) }}
  </a-avatar>
</template>
<script>
export default {
  name: 'EAvatar',
  props: {
    avatar: {
      type: String,
      default: null
    },
    nickname: {
      type: String,
      default: null
    },
    relativePath: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  data () {
    return {
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL
    }
  }
}
</script>
