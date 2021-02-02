/**
 * <a-button v-if="$auth('form.edit')">Button</a-button>
 * @param Vue
 */
function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$permissions && Object.defineProperties(Vue.prototype, {
    $permissions: {
      get () {
        const _this = this
        return (permissions) => {
          return _this.$store.getters.permissions.includes(permissions)
        }
      }
    }
  })
}

export default plugin
