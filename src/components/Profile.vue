<template>
  <div class="profile-container">
    <!-- <div class="profile-header">Profile</div> -->
    <div class="user-data-container">
      <!-- <div>Username: {{ user.username }}</div>
      <div>Email: {{ user.email }}</div>
      <div>Leagues</div> -->
      <!-- <div v-for="league of user.">

      </div> -->
      <form class="md-layout">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">User</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="first-name">Username</label>
                <md-input
                  name="username"
                  type="text"
                  class="input-field"
                  v-model="user.username"
                  :disabled="isUserDataDisabled"/>
                </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="first-name">Email</label>
                <md-input
                  name="username"
                  type="text"
                  class="input-field"
                  v-model="user.email"
                  :disabled="isUserDataDisabled"/>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="first-name">Avatar URL</label>
                <md-input
                  name="username"
                  type="text"
                  class="input-field"
                  v-model="user.avatarUrl"
                  :disabled="isUserDataDisabled"/>
                </md-field>
            </div>
          </div>
        </md-card-content>

        <md-button
          type="button"
          class="md-primary"
          @click="onEdit">
            {{ isUserDataDisabled ? 'Edit' : 'Save' }}
        </md-button>
      </md-card>

    </form>
    </div>
  </div>
</template>

<script>
import localStorageKeys from '../constants/localStorageKeys'
import getByProperties from '../constants/get-by-properties'
import * as axios from 'axios'
import { ApiRoutes } from '../utils/ApiRoutes'
import SpinnerService from '../services/SpinnerService'

export default {
  name: 'Profile',
  data () {
    return {
      user: null,
      token: null,
      leagues: null,
      isUserDataDisabled: true
    }
  },
  methods: {
    async getLeagues () {
      const leaguesPath = process.env.VUE_APP_BASE_URL + ApiRoutes.GET_LEAGUES.path
      SpinnerService.setSpinner(true)
      this.leagues = await axios.post(
        leaguesPath,
        { leagues: this.user.leagues, property: getByProperties.ID },
        { headers: this.getHeader() }
      )
      SpinnerService.setSpinner(false)
    },
    getHeader () {
      return {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + this.token
      }
    },
    onEdit () {
      this.isUserDataDisabled = !this.isUserDataDisabled
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

.profile-container {
  width: 600px;
  margin: auto;
}
.user-data-container {}
</style>
