<template>
  <a-result :title="title" :status="status">
    <template #icon v-if="loading">
      <a-spin size="large"/>
      {{ code }}
    </template>
    <template #extra v-if="!loading && status === 'success'">
      <a-button type="primary">
        登录
      </a-button>
    </template>
  </a-result>
</template>

<script>

import { verifies } from '@/api/sys/mail-verifies'
import { mapActions } from 'vuex'

export default {
  name: 'BindMail',
  data () {
    return {
      code: this.$route.params.code,
      status: 'error',
      loading: true,
      title: '正在验证，请稍候...'
    }
  },
  created () {
    this.verifies()
  },
  methods: {
    ...mapActions(['updateUser']),
    verifies () {
      verifies(this.code).then(res => {
        this.status = 'success'
        this.loading = false
        this.title = '验证成功，你已成功绑定邮箱'
      }).catch(({ response }) => {
        this.status = 'error'
        this.loading = false
        this.title = response.data.errorMessage
      })
    }
  }
}
</script>
<style scoped>
.ant-card {
  width: 30%;
  min-width: 320px;
  margin: 0 auto;
}
</style>
