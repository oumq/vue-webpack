import { routeConfig, VueRouter } from '../index'

const routes = [
  {
    path: '/',
    component: () =>
      import(
        /* webpackChunkName: "dotplot-index" */ '../../views/dotplot/index'
      )
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../../views/404')
  },
  {
    path: '*', // 此处需特别注意置于最底部
    redirect: '/404'
  }
]

export default new VueRouter({
  ...routeConfig,
  routes
})
