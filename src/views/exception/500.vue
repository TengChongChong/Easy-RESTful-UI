<template>
  <a-result status="500" title="500" sub-title="抱歉，服务出现异常。"/>
</template>

<script>
  export default {
    name: 'Exception500',
    methods: {
      toHome () {
        this.$router.push({ path: '/' })
      }
    }
  }
</script>
