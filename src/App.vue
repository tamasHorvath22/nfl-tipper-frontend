<template>
  <div id="app">
    <Spinner v-if="showSpinner"/>
    <div v-if="showMenu">
      <sidebar-menu :menu="menu" @item-click="onItemClick" @toggle-collapse="onToggleCollapse">
        <span
          slot="toggle-icon"
          class="toggle-icon">
          <i :class="isMenuOpen ? 'fa fa-angle-double-left' : 'fa fa-angle-double-right'"></i>
        </span>
      </sidebar-menu>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { Routes } from './utils/Routes'
import { SidebarMenu } from 'vue-sidebar-menu'
import Spinner from './components/Spinner'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import localStorageKeys from './constants/localStorageKeys'
// import SpinnerService from './services/SpinnerService'

export default {
  name: 'app',
  components: {
    SidebarMenu,
    Spinner
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
      showSpinner: false,
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
          icon: 'fa fa-user',
          class: 'menu-icon'
        },
        {
          href: '/leagues',
          title: 'Leagues',
          icon: 'fa fa-users'
        },
        {
          title: 'Logout',
          icon: 'fa fa-close'
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

<style scoped lang="scss">
@import './styles/_variables.scss';

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
  background-color: $nfl-blue;
}

/* oldalsó függőleges kék sáv */
.v-sidebar-menu .vsm--link_level-1.vsm--link_exact-active,
.v-sidebar-menu .vsm--link_level-1.vsm--link_active {
  -webkit-box-shadow: 3px 0px 0px 0px $nfl-red inset;
  box-shadow: 3px 0px 0px 0px $nfl-red inset
}

/* menu closed, icon hover background color */
.v-sidebar-menu.vsm_collapsed .vsm--link_level-1.vsm--link_hover .vsm--icon,
.v-sidebar-menu.vsm_collapsed .vsm--link_level-1:hover .vsm--icon {
  color: yellow !important;
  background-color: $nfl-red !important
}

/** menu closed, icon hover expand item background color */
.v-sidebar-menu .vsm--mobile-bg {
  background-color: $nfl-red
}

/** ???? */
.v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1 {
  color: #fff;
  background-color: #4285f4;
}

/** ???? */
.v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1 .vsm--icon {
  color: #fff;
  background-color: #4285f4;
}

/** ???? */
.v-sidebar-menu.vsm_rtl .vsm--link_level-1.vsm--link_active,
.v-sidebar-menu.vsm_rtl .vsm--link_level-1.vsm--link_exact-active {
  -webkit-box-shadow: -3px 0px 0px 0px #4285f4 inset;
  box-shadow: -3px 0px 0px 0px #4285f4 inset
}

/** ???? */
.v-sidebar-menu.vsm_white-theme .vsm--link_level-1.vsm--link_exact-active,
.v-sidebar-menu.vsm_white-theme .vsm--link_level-1.vsm--link_active {
  -webkit-box-shadow: 3px 0px 0px 0px #4285f4 inset;
  box-shadow: 3px 0px 0px 0px #4285f4 inset
}

/** ???? */
.v-sidebar-menu.vsm_white-theme.vsm_collapsed .vsm--link_level-1.vsm--link_hover .vsm--icon,
.v-sidebar-menu.vsm_white-theme.vsm_collapsed .vsm--link_level-1:hover .vsm--icon {
  color: #fff;
  background-color: #4285f4
}

/** ???? */
.v-sidebar-menu.vsm_white-theme .vsm--mobile-bg {
  background-color: #4285f4
}

/** ???? */
.v-sidebar-menu.vsm_white-theme.vsm_expanded .vsm--item_open .vsm--link_level-1 {
  color: #fff;
  background-color: #4285f4
}

/** ???? */
.v-sidebar-menu.vsm_white-theme.vsm_expanded .vsm--item_open .vsm--link_level-1 .vsm--icon {
  color: #fff;
  background-color: #4285f4
}

/** ???? */
.v-sidebar-menu.vsm_white-theme.vsm_rtl .vsm--link_level-1.vsm--link_active,
.v-sidebar-menu.vsm_white-theme.vsm_rtl .vsm--link_level-1.vsm--link_exact-active {
  -webkit-box-shadow: -3px 0px 0px 0px #4285f4 inset;
  box-shadow: -3px 0px 0px 0px #4285f4 inset
}
</style>
