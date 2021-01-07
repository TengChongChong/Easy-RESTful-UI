<template>
  <iframe id="view" :src="path" frameborder="0" :style="style"></iframe>
</template>
<script>
import { getElementOffset } from '@/utils/util'

export default {
  name: 'IframeView',
  data () {
    return {
      path: this.$route.query.path,
      style: {}
    }
  },
  mounted () {
    const iframe = document.getElementById('view')
    const offset = getElementOffset(iframe)
    const deviceHeight = document.documentElement.clientHeight
    this.style = {
      height: deviceHeight - offset.actualTop - 16 + 'px'
    }
  }
}
</script>
<style scoped>
iframe {
  width: 100%;
}
</style>
