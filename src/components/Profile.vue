<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-30 md-small-size-90 card-margin">
      <form v-if="user">
        <md-card class="card-bg">
          <md-card-header>
            <div class="md-title">{{ user.username }} data</div>
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
                    disabled/>
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

    <div class="md-layout-item md-size-50 md-small-size-90 card-margin">
      <md-card class="card-bg">

      <md-dialog-prompt
        :md-active.sync="isModalOpen"
        v-model="newLeagueName"
        md-title="Type the name of your league"
        md-input-placeholder="here..."
        @md-confirm="onCreateLeague"
        md-confirm-text="Create" />

        <md-card-header>
          <div class="leagues-header">My leagues</div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-size-25 md-small-size-100">
              <md-button class="md-primary md-raised create-league-button" @click="isModalOpen = true">Create league</md-button>
            </div>
            <div class="md-layout-item md-size-75 md-small-size-100">
              <div v-for="league in leagues" :key="league._id">
                <md-button
                  class="md-raised submit-button"
                  @click="onSelectLeague(league._id)">
                  {{ league.name }}
                </md-button>
              </div>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </div>

    <!-- <div class="md-layout-item md-small-size-100 md-medium-size-50">
      <md-button
        class="md-raised md-primary submit-button"
        @click="onInvite">
        Invite user
      </md-button>
      <md-button
        class="md-raised md-primary submit-button"
        @click="onDeleteInvitation">
        Delete invitation
      </md-button>
      <md-button
        class="md-raised md-primary submit-button"
        @click="onAcceptInvitation">
        Accept invitation
      </md-button>
    </div> -->

  </div>
</template>

<script>
import localStorageKeys from '../constants/localStorageKeys'
import * as axios from 'axios'
import { ApiRoutes } from '../utils/ApiRoutes'
import SpinnerService from '../services/SpinnerService'
import { Routes } from '../utils/Routes'

export default {
  name: 'Profile',
  data () {
    return {
      user: null,
      token: null,
      isUserDataDisabled: true,
      headers: null,
      leagues: [],
      TEMP_leagueId: '5f0de1d9ac1c5b253c69fe0f',
      isModalOpen: false,
      newLeagueName: null
    }
  },
  methods: {
    getHeader () {
      return {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + this.token
      }
    },
    onEdit () {
      if (this.isUserDataDisabled) {
        this.isUserDataDisabled = !this.isUserDataDisabled
        return
      }
      this.$validator.validateAll().then(valid => {
        const changePath = process.env.VUE_APP_BASE_URL + ApiRoutes.CHANGE_USER_DATA.path
        if (valid) {
          axios.post(changePath, this.user, { headers: this.getHeader() })
            .then(registerResp => {
              console.log(changePath)
              this.isUserDataDisabled = true
              // this.handleRegisterResponse(registerResp.data)
            })
        }
      })
    },
    async onCreateLeague () {
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.CREATE_LEAGUE.path}`
      await axios.post(path, { name: this.newLeagueName, leagueAvatarUrl: null }, { headers: this.headers })
        .then(resp => {
          console.log(resp)
        })
    },
    async onDeleteInvitation () {
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.DELETE_LEAGUE_INVITATION.path}`
      await axios.post(path, { leagueId: this.TEMP_leagueId, invitedEmail: 'tompa22@gmail.com' }, { headers: this.headers })
        .then(resp => {
          console.log(resp)
        })
      // TODO, continue
    },
    async onAcceptInvitation () {
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.ACCEPT_LEAGUE_INVITATION.path}`
      await axios.post(path, { leagueId: this.TEMP_leagueId }, { headers: this.headers })
        .then(resp => {
          console.log(resp)
        })
      // TODO, continue
    },
    async getLeagues () {
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.GET_LEAGUES.path}`
      await axios.post(path, { leagueIds: this.user.leagues }, { headers: this.headers })
        .then(leagues => {
          this.leagues = leagues.data
          SpinnerService.setSpinner(false)
        })
    },
    onSelectLeague (leagueId) {
      this.$router.push({ name: Routes.LEAGUES.name, params: { leagueId: leagueId } })
    }
  },
  mounted () {
    SpinnerService.setSpinner(true)
    this.user = JSON.parse(localStorage.getItem(localStorageKeys.NFL_TIPPER_USER))
    this.token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
    this.headers = {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + this.token
    }
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
.user-data-container {
  margin-top: 50px;
}

.card-margin {
  margin-left: 5%;
  margin-top: 30px;
}

.card-bg {
  background-color: rgb(181, 186, 192);
}
.create-league-button {
  margin: 20px;
}
.leagues-header {
  font-size: 26px;
}
</style>
