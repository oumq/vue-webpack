import { routeConfig, VueRouter } from '../index'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () =>
      import(
        /* webpackChunkName: "apple-home" */ '../../views/apple/home/index'
      )
  }
]

export default new VueRouter({
  ...routeConfig,
  routes
})
