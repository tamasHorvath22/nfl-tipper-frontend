<template>
  <div class="profile-container">
    <!-- <div class="profile-header">Profile</div> -->
    <div class="user-data-container">
      <!-- <div>Username: {{ user.username }}</div>
      <div>Email: {{ user.email }}</div>
      <div>Leagues</div> -->
      <!-- <div v-for="league of user.">

      </div> -->
    </div>
  </div>
</template>

<script>
import localStorageKeys from '../constants/localStorageKeys'
import getByProperties from '../constants/get-by-properties'
import * as axios from 'axios'
import { ApiRoutes } from '../utils/ApiRoutes'

export default {
  name: 'Profile',
  data () {
    return {
      user: null,
      token: null,
      leagues: null
    }
  },
  methods: {
    async getLeagues () {
      const leaguesPath = process.env.VUE_APP_BASE_URL + ApiRoutes.GET_LEAGUES.path
      this.leagues = await axios.post(
        leaguesPath,
        { leagues: this.user.leagues, property: getByProperties.ID },
        { headers: this.getHeader() }
      )
    },
    getHeader () {
      return {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + this.token
      }
    }
  },
  mounted () {
    this.user = JSON.parse(localStorage.getItem(localStorageKeys.NFL_TIPPER_USER))
    this.token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
    this.getLeagues()
  }
}
</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';

.profile-header {
  font-size: 30pt;
}

.profile-container {}
.user-data-container {}
</style>
