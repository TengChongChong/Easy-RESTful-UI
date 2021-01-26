import { UserLayout, BasicLayout } from '@/layouts'

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/redirect',
    component: BasicLayout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/iframe',
    component: BasicLayout,
    hidden: true,
    children: [
      {
        path: '/iframe',
        name: 'IframeView',
        meta: {
          title: 'Iframe'
        },
        component: () => import('@/views/iframe/View')
      }
    ]
  },
  {
    path: '/sys/mail-verifies',
    component: UserLayout,
    hidden: true,
    children: [
      {
        path: '/sys/mail-verifies/bind-mail/:code',
        name: 'BindMail',
        component: () => import('@/views/sys/mail-verifies/bind-mail')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/global/404')
  }

]
