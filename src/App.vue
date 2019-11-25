<template>
  <div id="app">
    <div v-if="showMenu">
      <sidebar-menu :menu="menu" @item-click="onItemClick" @toggle-collapse="onToggleCollapse">
        <span
          slot="toggle-icon"
          class="toggle-icon">
          <i class="fa"
          :class="isMenuOpen ? 'fa-angle-double-left' : 'fa-angle-double-right'"></i>
        </span>
      </sidebar-menu>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { Routes } from './utils/Routes'
import { SidebarMenu } from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import localStorageKeys from './constants/localStorageKeys'

export default {
  name: 'app',
  components: {
    SidebarMenu
  },
  methods: {
    onItemClick (event, item) {
      if (item.title === 'Logout') {
        localStorage.removeItem(localStorageKeys.NFL_TIPPER_TOKEN)
        localStorage.removeItem(localStorageKeys.NFL_TIPPER_USER)
        this.$router.push(Routes.LOGIN.path)
      }
    },
    onToggleCollapse () {
      this.isMenuOpen = !this.isMenuOpen
    }
  },
  data () {
    return {
      showMenu: false,
      isMenuOpen: true,
      menu: [
        {
          header: true,
          title: 'Menu',
          // hidden: false
          hiddenOnCollapse: true
          // class: ''
          // attributes: {}
        },
        {
          href: '/profile',
          title: 'Profile',
          icon: 'fa fa-user'
        },
        {
          href: '/leagues',
          title: 'Leagues',
          icon: 'fa fa-users'
        },
        {
          title: 'Logout',
          class: 'logout-button'
        }
      ]
    }
  },
  watch: {
    $route (to, from) {
      this.showMenu = !(to.fullPath === Routes.LOGIN.path || to.fullPath === Routes.REGISTER.path)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.toggle-icon {
  font-size: 20px;
}
.v-sidebar-menu {
  width: 200px;
  background-color: rgba(65, 57, 57, 0.8);
}
.logout-button {
  margin-top: 50px;
}

/* .v-sidebar-menu .vsm--item {background-color: green;}
.v-sidebar-menu .vsm--link {background-color: green;}
.v-sidebar-menu .vsm--mobile-bg {background-color: green;  color: red;} */

</style>
