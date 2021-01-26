<template>
  <a-result title="抱歉，你访问的页面正在开发中。">
    <template #icon>
      <a-icon type="codepen-circle"/>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'UnderDevelopment',
  methods: {
    toHome () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
