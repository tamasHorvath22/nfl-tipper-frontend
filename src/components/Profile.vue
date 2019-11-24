<template>
  <div class="profile-container">
    <div class="profile-header">Profile</div>
    <div class="user-data-container">
    </div>
  </div>
</template>

<script>
// import { Routes } from '../utils/Routes'
// import * as axios from 'axios'
// import UserService from '../services/UserService'

export default {
  name: 'Profile',
  data () {
    return {
      user: null
    }
  },
  methods: {},
  mounted () {
    this.user = JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
  }
}
</script>

<style scoped>
.profile-header {
  font-size: 30pt;
}
.profile-container {}
.user-data-container {}
</style>
