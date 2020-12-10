/**
 * 用户菜单
 */

const menu = {
  state: {
    menus: []
  },
  mutations: {
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },
  actions: {
    setMenus ({ commit }, menus) {
      commit('SET_MENUS', menus)
    }
  }
}

export default menu
