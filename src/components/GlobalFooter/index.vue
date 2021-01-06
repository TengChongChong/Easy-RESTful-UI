<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://gitee.com/tcc/easy-restful-ui" target="_blank">Easy-RESTful</a>
    </template>
    <template v-slot:copyright>
      <a href="https://www.antdv.com/docs/vue/introduce-cn" target="_blank">Ant Design</a>
      <a-divider type="vertical" />
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
  }
}
</script>
