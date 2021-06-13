import Vue from 'vue'
import App from './app.vue'
import router from '@/routes/modules/apple'
import '@/style/index.scss'
import 'tailwindcss/tailwind.css'

Vue.config.devtools = false
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
