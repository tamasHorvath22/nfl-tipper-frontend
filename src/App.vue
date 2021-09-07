<template>
  <div id="app">
    <Spinner v-if="showSpinner"/>
    <div class="nfl-bg-image"></div>
    <b-navbar v-if="showMenu" toggleable="lg" type="dark" variant="primary" class="nav-bar" fixed="top">
      <b-navbar-brand @click="onLeagues" class="bar-tipper">NFL Tipper</b-navbar-brand>

        <b-navbar-nav class="bold">
          <b-nav-item @click="onProfile">Profile</b-nav-item>
          <b-nav-item @click="onLeagues">Leagues</b-nav-item>
          <b-nav-item @click="onRules">Rules</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-navbar-nav class="bold">
            <b-nav-item @click="onLogout">Logout</b-nav-item>
          </b-navbar-nav>
        </b-navbar-nav>
    </b-navbar>
    <router-view class="router"></router-view>
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
      this.$router.push(Routes.LOGIN.path)
    },
    onProfile () {
      this.$router.push(Routes.PROFILE.path)
    },
    onLeagues () {
      this.$router.push(Routes.LEAGUES.path)
    },
    onRules () {
      this.$router.push(Routes.RULES.path)
    },
    onToggleCollapse () {
      this.isMenuOpen = !this.isMenuOpen
    },
    toggleSpinner (isVisible) {
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
    SpinnerService.subscribe(this.toggleSpinner)
  }
}
</script>

<style scoped lang="scss">
@import './styles/_variables.scss';
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

.bar-tipper {
  cursor: pointer;
}
.nfl-bg-image {
  background-image: url('./assets/images/ball.jpg') !important;
}

@media(max-width: 1024px) {
  .nfl-bg-image {
    background: center;
  }
}

@media(min-width: 1025px) {
  .nfl-bg-image {
    background-size: 100%;
  }
}

.nfl-bg-image {
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.5;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: $background-color;
  min-height: 100vh;
}
.toggle-icon {
  font-size: 20px;
}
.bold {
  font-weight: bold;
}
.nav-bar {
  background-color: $nfl-blue !important;
}
.nav-bar {
  .navbar-nav {
    flex-direction: row;
    .nav-item {
      margin-right: 10px;
    }
  }
}
.router {
  padding-top: 50px;
}

</style>
