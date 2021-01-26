<template>
  <a-result status="404" title="404" sub-title="抱歉，你请求的页面不存在。"/>
</template>

<script>
export default {
  name: 'Exception404',
  methods: {
    toHome () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
