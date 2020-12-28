const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  roles: state => state.user.roles,
  user: state => state.user.user,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  menu: state => state.menu.menus
}

export default getters
