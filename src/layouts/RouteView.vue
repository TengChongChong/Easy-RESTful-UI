<template>
  <keep-alive :include="cachedViews">
    <router-view :key="key" />
  </keep-alive>
</template>

<script>
export default {
  name: 'RouteView',
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    key () {
      return this.$route.fullPath
    }
  }
}
</script>
