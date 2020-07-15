import Vue from 'vue'
import Router from 'vue-router'
import { Routes } from './utils/Routes'
import localStorageKeys from './constants/localStorageKeys'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  // base: 'localhost:8080/', // process.env.BASE_URL,
  // scrollBehavior (to) {
  //   return { x: 0, y: 0 }
  // },
  routes: [
    {
      path: Routes.ROOT.path,
      name: Routes.ROOT.name,
      component: () => import('./components/Profile.vue'),
      beforeEnter: (to, from, next) => {
        console.log(from)
        console.log(to)
        if (localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)) {
          next()
        } else {
          next(Routes.LOGIN.path)
        }
      }
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
    },
    // {
    //   path: Routes.PROFILE.path,
    //   name: Routes.PROFILE.name,
    //   component: () => import('./components/Profile.vue')
    // },
    {
      path: Routes.LEAGUES.path,
      name: Routes.LEAGUES.name,
      component: () => import('./components/Leagues.vue')
    },
    {
      path: Routes.JOIN_LEAGUE.path,
      name: Routes.JOIN_LEAGUE.name,
      component: () => import('./components/JoinLeague.vue'),
      beforeEnter: (to, from, next) => {
        // this.$router.push(Routes.LOGIN.path)
        console.log(from)
        console.log(to)
        if (localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)) {
          next()
        } else {
          localStorage.setItem('LEAUGE-JOIN-TOKEN', to.params.token)
          next(Routes.LOGIN.path)

          // this.$router.push(Routes.LOGIN.path)
        }
      }
    },
    {
      path: '*',
      redirect: Routes.ROOT.path
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   if (to.path === Routes.LOGIN.path || to.path === Routes.REGISTER.path) {
//     next()
//     return
//   }
//   if (localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)) {
//     next()
//   } else {
//     next(Routes.LOGIN.path)
//   }
// })
