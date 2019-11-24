import Vue from 'vue'
import Router from 'vue-router'
import { Routes } from './utils/Routes'

Vue.use(Router)

export const router = new Router({
  // mode: 'history',
  // base: 'localhost:8080/', // process.env.BASE_URL,
  // scrollBehavior (to) {
  //   return { x: 0, y: 0 }
  // },
  routes: [
    {
      path: '/',
      redirect: Routes.LOGIN.path
    },
    {
      path: Routes.LOGIN.path,
      name: Routes.LOGIN.name,
      component: () => import('./components/Login.vue')
    },
    {
      path: Routes.REGISTER.path,
      name: Routes.REGISTER.name,
      component: () => import('./components/Register.vue')
    }
  ]
})
