<template>
  <div id="app">
    <Spinner v-if="showSpinner"/>
    <b-navbar v-if="showMenu" toggleable="lg" type="dark" variant="primary" class="nav-bar">
      <b-navbar-brand href="#">NFL Tipper</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="bold">
          <b-nav-item @click="onProfile">Profile</b-nav-item>
          <b-nav-item @click="onLeagues">Leagues</b-nav-item>
          <!-- <b-nav-item href="#" >Disabled</b-nav-item> -->
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!-- <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form> -->
          <b-navbar-nav class="bold">
            <b-nav-item @click="onLogout">Logout</b-nav-item>
          </b-navbar-nav>

          <!-- <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown> -->

          <!-- Using 'button-content' slot -->
          <!-- <b-nav-item-dropdown right>
            <template v-slot:button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown> -->

        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import { Routes } from './utils/Routes'
import Spinner from './components/Spinner'
import localStorageKeys from './constants/localStorageKeys'
import SpinnerService from './services/SpinnerService'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import './custom.scss'

export default {
  name: 'app',
  components: {
    Spinner
  },
  methods: {
    onLogout (event, item) {
      localStorage.removeItem(localStorageKeys.NFL_TIPPER_TOKEN)
      localStorage.removeItem(localStorageKeys.NFL_TIPPER_USER)
      this.$router.push(Routes.LOGIN.path)
    },
    onProfile () {
      this.$router.push(Routes.PROFILE.path)
    },
    onLeagues () {
      this.$router.push(Routes.LEAGUES.path)
    },
    onToggleCollapse () {
      this.isMenuOpen = !this.isMenuOpen
    },
    setSpinner (isVisible) {
      this.showSpinner = isVisible
    }
  },
  data () {
    return {
      showMenu: false,
      isMenuOpen: true,
      showSpinner: false
    }
  },
  watch: {
    $route (to, from) {
      const confirmPath = Routes.CONFIRM_EMAIL.path.substring(0, 14)
      const resetPassPath = Routes.RESET_PASSWORD.path.substring(0, 15)
      this.showMenu = !(
        to.fullPath === Routes.LOGIN.path ||
        to.fullPath === Routes.REGISTER.path ||
        to.fullPath.startsWith(confirmPath) ||
        to.fullPath.startsWith(resetPassPath))
    }
  },
  created () {
    SpinnerService.subscribe(this.setSpinner)
  }
}
</script>

<style scoped lang="scss">
@import './styles/_variables.scss';
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: $nfl-blue;
  min-height: 100vh;
}
.toggle-icon {
  font-size: 20px;
}
.v-sidebar-menu {
  width: 200px;
  background-color: $nfl-blue;
}

.bold {
  font-weight: bold;
}

.nav-bar {
  background-color: $nfl-red !important;
}

</style>
