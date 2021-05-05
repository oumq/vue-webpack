import Vue from 'vue'
import App from './app.vue'
import router from '@/routes/modules/apple'
import '@/style/index.scss'

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
