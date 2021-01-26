<template>
  <a-result status="403" title="403" sub-title="抱歉，你没有权限访问此页面。"/>
</template>

<script>
export default {
  name: 'Exception403',
  methods: {
    toHome () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
