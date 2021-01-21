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
      style: {},
      timer: null
    }
  },
  mounted () {
    this.calcHeight()
    // 添加 resize 绑定事件
    window.addEventListener('resize', this.resizeCallback, false)
  },
  methods: {
    /**
     * 窗口改变回调
     */
    resizeCallback () {
      // 使用定时器调用，防止持续拖动多次调用
      clearInterval(this.timer)
      this.timer = setTimeout(() => {
        this.calcHeight()
      }, 500)
    },
    calcHeight () {
      const iframe = document.getElementById('view')
      const offset = getElementOffset(iframe)
      const deviceHeight = document.documentElement.clientHeight
      this.style = {
        height: deviceHeight - offset.actualTop - 16 + 'px'
      }
    }
  },
  beforeDestroy () {
    // 删除绑定的resize事件
    window.removeEventListener('resize', this.resizeCallback)
  }
}
</script>
<style scoped>
iframe {
  width: 100%;
}
</style>
