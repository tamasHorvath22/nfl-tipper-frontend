<template>
  <div id="app">
    <div v-if="showMenu">Menu</div>
    <router-view></router-view>
  </div>
</template>

<script>
import { Routes } from './utils/Routes'

export default {
  name: 'app',
  components: {},
  data () {
    return {
      showMenu: false
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
</style>
