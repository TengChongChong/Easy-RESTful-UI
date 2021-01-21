import { BlankLayout, PageView, RouteView } from '@/layouts'
import { deepClone } from '@/utils/util'
import { OPEN_MODE_CONST } from '@/utils/const/sys/OpenModeConst'
import store from '@/store'

// 前端路由表
const constantRouterComponents = {
  BasicLayout: () => import('@/layouts/BasicLayout'),
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import('@/views/exception/403'),
  '404': () => import('@/views/exception/404'),
  '500': () => import('@/views/exception/500'),
  // exception
  'Exception403': () => import('@/views/exception/403'),
  'Exception404': () => import('@/views/exception/404'),
  'Exception500': () => import('@/views/exception/500')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

/**
 * 动态生成菜单
 * @param menus
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (menus) => {
  return new Promise((resolve, reject) => {
    // 树结构菜单
    const childrenNav = []
    // 将后端数据转为树结构菜单
    listToTree(menus, childrenNav, '0')
    const menuNav = [{
      id: '',
      name: '首页',
      path: '/',
      component: 'BasicLayout',
      redirect: '/sys/personal/center',
      children: childrenNav
    }]
    const routers = generator(menuNav)
    // 设置菜单
    store.dispatch('setMenus', deepClone(routers, ['component']))
    // 由于3级及以上菜单缓存问题，此处菜单降级为2级
    getFlatRoutes(routers)
    // 路由全部设置为2级
    routers[0].children = [{
      path: '/base',
      name: 'base',
      component: RouteView,
      meta: { title: 'base' },
      children: routers[0].children
    }]
    // 404
    routers.push(notFoundRouter)
    resolve(routers)
  })
}

// 几个用到的方法
// 二级以上的菜单降级成二级菜单
const formatRouter = (routes, list = []) => {
  routes.map(item => {
    if (item.children && item.children.length > 0) {
      const arr = formatRouter(item.children, list)
      delete item.children
      list.concat(arr)
    }
    list.push(item)
  })
  return list
}

// 菜单降级
export const getFlatRoutes = (routes) => {
  return routes.map((child) => {
    if (child.children && child.children.length > 0) {
      child.children = formatRouter(child.children, [])
    }
    return child
  })
}

function generatorName (menu) {
  if (menu.component) {
    const paths = menu.component.split(/\/|-/)
    let name = ''
    paths.map(item => {
      name += item.replace(/^\S/, function (s) { return s.toUpperCase() })
    })
    return name
  } else {
      return `${menu.name}-${menu.id}`
  }
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { name, hide, hidden, hideChildren, hiddenHeaderContent, target, icon } = item || {}
    let parentPaths
    if (parent) {
      parentPaths = parent.meta.paths.concat([parent.path])
    } else {
      parentPaths = []
    }
    const currentRouter = {
      path: item.path || `${parent && parent.path || ''}/${item.id}`,
      // 路由名称，建议唯一
      name: generatorName(item),
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: name,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: OPEN_MODE_CONST.NEW_WINDOW === target ? '_blank' : null,
        permission: item.code,
        paths: parentPaths,
        hidden: hide === '1'
      },
      hidden
    }
    if (target == null || OPEN_MODE_CONST.DEFAULT === target) {
      // 该路由对应页面
      currentRouter.component = item.component ? (constantRouterComponents[item.component]) || (() => import(`@/views${item.component}`)) : RouteView
    }
    // 是否设置了隐藏菜单
    if (hide === '1') {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param pId 父ID
 */
const listToTree = (list, tree, pId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.pId === pId) {
      const child = {
        ...item,
        id: item.id || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
