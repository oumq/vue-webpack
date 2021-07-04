import Vue from 'vue'
import App from './app.vue'
import router from '@/routes/modules/dotplot'
import '@/style/index.scss'

Vue.config.devtools = false
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
