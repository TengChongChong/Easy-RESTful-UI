<template>
  <a-avatar
    :size="size"
    v-if="avatar != null && avatar !== ''"
    :src="(relativePath ? VUE_APP_API_BASE_URL : '') + avatar"/>
  <a-avatar :size="size" v-else>
    {{ nickname && nickname.substr(0, 1) }}
  </a-avatar>
</template>
<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'

export default {
  name: 'EAvatar',
  props: {
    avatar: PropTypes.string.def(),
    nickname: PropTypes.string.def(),
    relativePath: PropTypes.bool.def(true),
    size: PropTypes.string.def('default')
  },
  data () {
    return {
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL
    }
  }
}
</script>
<style lang="less">
@import '~ant-design-vue/es/style/themes/default.less';

.ant-avatar {
  color: @primary-color;
  background-color: color(~`colorPalette('@{primary-color}', 1) `);
}
</style>
