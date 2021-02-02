import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'

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
        component: () => import('@/views/sys/login/Login')
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
    path: '/user',
    component: BlankLayout,
    hidden: true,
    children: [
      {
        path: '/user/retrieve/password',
        name: 'RetrievePassword',
        component: () => import('@/views/sys/user/RetrievePassword')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/global/404')
  }

]
