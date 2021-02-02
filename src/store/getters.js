const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  permissions: state => state.user.permissions,
  user: state => state.user.user,
  unreadCount: state => state.user.unreadCount,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  menu: state => state.menu.menus,
  currentTopMenu: state => state.menu.currentTopMenu
}

export default getters
