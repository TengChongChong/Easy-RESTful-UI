/**
 * 用户菜单
 */

const menu = {
  state: {
    menus: [],
    currentTopMenu: null
  },
  mutations: {
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_CURRENT_TOP_MENU: (state, currentTopMenu) => {
      state.currentTopMenu = currentTopMenu
    }
  },
  actions: {
    setMenus ({ commit }, menus) {
      commit('SET_MENUS', menus)
    },
    setCurrentTopMenu ({ commit }, currentTopMenu) {
      commit('SET_CURRENT_TOP_MENU', currentTopMenu)
    }
  }
}

export default menu
