import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import VeeValidate from 'vee-validate'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import './styles/style.scss'

Vue.use(VeeValidate)
Vue.use(VueMaterial)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
