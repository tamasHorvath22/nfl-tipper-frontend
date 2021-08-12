import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VeeValidate from 'vee-validate'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import './styles/style.scss'
import VModal from 'vue-js-modal'
import './registerServiceWorker'

Vue.use(VeeValidate)
Vue.use(VueMaterial)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VModal)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
