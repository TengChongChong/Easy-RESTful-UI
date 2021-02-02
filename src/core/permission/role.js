/**
 * <a-button v-if="$role('admin')">Button</a-button>
 * @param Vue
 */
function plugin (Vue) {
  if (plugin.installed) {
    return
  }
  !Vue.prototype.$role && Object.defineProperties(Vue.prototype, {
    $role: {
      get () {
        const _this = this
        return (role) => {
          return _this.$store.getters.user.roles.includes(role)
        }
      }
    }
  })
}

export default plugin
