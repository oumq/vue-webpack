import Vue from 'vue'
import App from './app.vue'
import router from '@/routes/modules/apple'
import '@/style/index.scss'
// import '@/style/css/tailwind.css'
import 'tailwindcss/tailwind.css'

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
