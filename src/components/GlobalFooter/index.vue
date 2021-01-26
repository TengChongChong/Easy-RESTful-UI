<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://gitee.com/tcc/easy-restful-ui" target="_blank">Easy-RESTful-UI <small>v{{ version }}</small></a>
    </template>
    <template v-slot:copyright>
      <a href="https://gitee.com/tcc/Easy-RESTful" target="_blank">Easy RESTful</a>
      <a-divider type="vertical"/>
      <a href="https://www.antdv.com/docs/vue/introduce-cn" target="_blank">Ant Design</a>
      <a-divider type="vertical"/>
      <a href="https://pro.antdv.com" target="_blank">Ant Design Pro</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  },
  data () {
    return {
      version: process.env.VUE_APP_VERSION
    }
  }
}
</script>
<style scoped>
.ant-pro-global-footer-links a:not(:last-child) {
  margin-right: 15px;
}
</style>
