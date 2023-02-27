import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/index')
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: 'layout' */'@/views/layout/index'),
    meta: { requiresAuth: true },
    children: [
      {
        // 这里设置为空，则访问 / 地址时，展示 Home 组件
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */'@/views/home/index')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */'@/views/role/index')
      },
      {
        path: '/role/:roleId/allocate-menu',
        name: 'allocate-menu',
        component: () => import(/* webpackChunkName: 'allocate-menu' */'@/views/role/allocate-menu'),
        props: true /* 让路径参数通过 props 方式传递给组件 */
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/index')
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create' */'@/views/menu/create')
      },
      {
        path: '/menu/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-edit' */'@/views/menu/edit')
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */'@/views/resource/index')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */'@/views/course/index')
      },
      {
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'course-create' */'@/views/course/create')
      },
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName: 'course-edit' */'@/views/course/edit'),
        props: true /* 让路径参数通过 props 方式传递给组件 */
      },
      {
        path: '/course/:courseId/section',
        name: 'course-section',
        component: () => import(/* webpackChunkName: 'course-section' */'@/views/course/section'),
        props: true /* 让路径参数通过 props 方式传递给组件 */
      },
      {
        path: '/course/:courseId/video',
        name: 'course-video',
        component: () => import(/* webpackChunkName: 'course-video' */'@/views/course/video'),
        props: true /* 让路径参数通过 props 方式传递给组件 */
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */'@/views/user/index')
      },
      {
        path: '/ads',
        name: 'ads',
        component: () => import(/* webpackChunkName: 'ads' */'@/views/ads/index')
      },
      {
        path: '/ads-space',
        name: 'ads-space',
        component: () => import(/* webpackChunkName: 'ads-space' */'@/views/ads-space/index')
      },
      {
        path: '/*',
        name: 'error-page',
        component: () => import(/* webpackChunkName: 'error-page' */'@/views/error-page/index')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 全局前置导航守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查 store 中的 user 是否存在
    if (!store.state.user) {
      // user不存在，表示未登录，跳转到登录界面进行登录
      next({
        name: 'login',
        // 通过 query 属性记录下每次跳转是的目标路由地址
        // 方便后面由于登录状态过期导致重新登录时，登录后可以跳转到上次访问的页面，而不是每次都默认跳转到首页
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      // user 存在，表示已经进行了登录，则允许通过
      next()
    }
  } else {
    // 无需登录，允许通过
    next()
  }
})

export default router
