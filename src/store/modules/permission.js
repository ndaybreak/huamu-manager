import { asyncRouterMap, constantRouterMap } from '@/router'
import { deepClone } from '@/utils'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function formatAsyncRouter(asyncRouterMap, menus) {
  // debugger
  const data = deepClone(asyncRouterMap)
  // const menus = deepClone(menusCopied)
  return data.map(route => {
    if (menus.indexOf(route.meta.id) >= 0) {
      if (!route.hidden) {
        route.hidden = false
      }
      if (route.children) {
        route.children = formatAsyncRouter(route.children, menus)
      }
    } else {
      route.hidden = true
    }
    return route
  })
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        // const { menus } = data
        const menus = localStorage.getItem('menus') || ''
        commit('SET_ROUTERS', formatAsyncRouter(asyncRouterMap, menus.split(',')))
        resolve()
      })
    }
  }
}

export default permission
