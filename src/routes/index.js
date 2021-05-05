import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routeConfig = {
  mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash',
  scrollBehavior: () => ({ x: 0, y: 0 })
}

export { VueRouter, routeConfig }
