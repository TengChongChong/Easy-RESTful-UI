import storage from 'store'
import { login, getInfo, logout } from '@/api/sys/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { selectUnreadCount } from '@/api/sys/message'

const user = {
  state: {
    token: '',
    roles: [],
    permissions: [],
    user: {},
    unreadCount: 0
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_UNREAD_COUNT: (state, unreadCount) => {
      state.unreadCount = unreadCount
    },
    SET_LOGOUT: (state) => {
      state.token = ''
      state.roles = []
      state.permissions = []
      state.user = {}
      state.unreadCount = 0
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const token = response.data
          storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data
          if (result.roles.length > 0 && result.permissionList.length > 0) {
            const roles = result.roles
            // const permissions = result.permissionList

            // permissions.map(per => {
            //   if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
            //     const action = per.actionEntitySet.map(action => { return action.action })
            //     per.actionList = action
            //   }
            // })
            // role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_PERMISSIONS', result.permissionList)
            commit('SET_ROLES', roles)
            commit('SET_USER', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_LOGOUT')

          this.dispatch('tagsView/delAllViews')
          this.dispatch('setMenus', [])
          this.dispatch('setCurrentTopMenu', null)
          this.dispatch('GenerateRoutes', [])
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          storage.remove(ACCESS_TOKEN)
        })
      })
    },
    /**
     * 更新用户信息
     *
     * @param commit
     */
    UpdateUser ({ commit }) {
      if (storage.get(ACCESS_TOKEN)) {
        getInfo().then(res => {
          commit('SET_USER', res.data)
        })
      }
    },
    SetUser ({ commit }, user) {
      commit('SET_USER', user)
    },
    SelectUnreadCount ({ commit }) {
      if (storage.get(ACCESS_TOKEN)) {
        selectUnreadCount().then(res => {
          commit('SET_UNREAD_COUNT', res.data)
        })
      }
    }
  }
}

export default user
