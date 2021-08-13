<template>
  <div v-if="user" class="md-layout">
    <md-card class="md-layout-item md-size-50 md-medium-size-70 md-small-size-90 container">

      <md-card-header>
        <div class="leagues-header">{{ user.username }}'s leagues</div>
        <hr>
      </md-card-header>
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-size-25 md-small-size-100">
            <md-button
              class="md-primary md-raised button-margin-0-20 material-button"
              @click="showModal(modals.createLeague)">
              Create league
            </md-button>

            <div v-if="user">
              <md-card class="invitation-card">
                <div class="invitation-header">Invitations</div>
                <div v-if="user.invitations.length">
                  <div v-for="inv of user.invitations" :key="inv.leagueId">
                    <md-button
                      class="md-primary md-raised material-button invitation-button"
                      @click="showModal(modals.acceptInvitation, inv)">
                      {{ inv.name }}
                    </md-button>
                  </div>
                </div>
                <div v-if="!user.invitations.length">
                  You have no invitations.
                </div>
              </md-card>
            </div>
          </div>
          <md-card
            v-if="user && userLeagues"
            class="md-layout-item md-size-70 md-small-size-100 leagues-card">
            <md-card
              v-for="league in userLeagues"
              :key="league.leagueId"
              class="league-card">
              <div @click="onSelectLeague(league.id)" class="league-container">
                <div class="avatar-container">
                  <img :src="getLeagueAvatar(league.avatar)">
                </div>
                <div class="league-name">{{ league.name }}</div>
              </div>
            </md-card>
          </md-card>
        </div>

        <modal :name="modals.createLeague" width="400" height="auto">
          <div class="modal-container">
            <div class="modal-headers">Type the name of your league</div>
            <md-field>
              <md-input
                name="newLeague"
                placeholder="here..."
                v-model="newLeagueName"
                ref="newLeagueInput"/>
            </md-field>
            <md-button
              class="md-raised button-margin-0-20 material-button"
              @click="hideModal(modals.createLeague)">
              Close
            </md-button>
            <md-button
              class="md-primary md-raised button-margin-0-20 material-button"
              @click="onCreateLeague">
              Create
            </md-button>
            <div
              v-if="showCreateLeagueError"
              class="error-message">
              There was an error while creating your league. Please try again!
            </div>
          </div>
        </modal>

        <modal :name="modals.acceptInvitation" width="400" height="auto">
          <div v-if="currentLeagueToJoin" class="modal-container">
            <div
              class="modal-headers">
              Do you accept the invitation to "{{ currentLeagueToJoin.name }}" league?
            </div>
            <md-button
              class="md-raised button-margin-0-20 material-button"
              @click="hideModal(modals.acceptInvitation)">
              Close
            </md-button>
            <button
              class="md-raised button-margin-0-20 material-button accept-invitation"
              @click="onAcceptInvitation">
              Yes
            </button>
            <div
              v-if="showAcceptInvitationError"
              class="error-message">
              There was an error while joining the league. Please try again!
            </div>
          </div>
        </modal>

        <modal :name="modals.unexpectedError" width="400" height="auto">
          <div class="modal-container">
            <div
              v-if="showAcceptInvitationError"
              class="error-message">
              There was an unexpected error. Please try again!
            </div>
            <button
              class="md-raised button-margin-0-20 material-button accept-invitation"
              @click="reloadPage()">
              Ok
            </button>
          </div>
        </modal>

        <modal :name="modals.acceptInvitationError" width="400" height="auto">
          <div class="modal-container">
            <div class="margin-bottom-30">
              There was an error while trying to join the league. Please try again!
            </div>
            <md-button
              class="md-primary md-raised material-button"
              @click="hideModal(modals.acceptInvitationError)">
              Ok
            </md-button>
          </div>
        </modal>

      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import localStorageKeys from '../constants/localStorageKeys'
import * as axios from 'axios'
import { ApiRoutes } from '../utils/ApiRoutes'
import SpinnerService from '../services/SpinnerService'
import { Routes } from '../utils/Routes'
import ApiErrorMessages from '../constants/api-response-messages'
import utilsMixin from '../mixins/utils'
import leagueMixin from '../mixins/leagueMixin'

export default {
  name: 'Leagues',
  mixins: [utilsMixin, leagueMixin],
  data () {
    return {
      modals: {
        acceptInvitation: 'accept-invitation-modal',
        createLeague: 'create-league',
        acceptInvitationError: 'accept-invitation-error',
        unexpectedError: 'unexpected-error'
      },
      user: null,
      userLeagues: null,
      token: null,
      newLeagueName: null,
      currentLeagueToJoin: null,
      showCreateLeagueError: false,
      showAcceptInvitationError: false
    }
  },
  methods: {
    onCreateLeague () {
      SpinnerService.setSpinner(true)
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.CREATE_LEAGUE.path}`
      axios.post(path,
        { name: this.newLeagueName, leagueAvatarUrl: null },
        { headers: this.getHeader(this.token) })
        .then(resp => {
          if (resp.data === ApiErrorMessages.LEAGUE.CREATE_FAIL) {
            this.showCreateLeagueError = true
          } else {
            this.hideModal(this.modals.createLeague)
            this.handleUserResponse(resp.data)
          }
          SpinnerService.setSpinner(false)
        })
        .catch(() => {
          this.showCreateLeagueError = true
          SpinnerService.setSpinner(false)
        })
    },
    onAcceptInvitation () {
      this.showAcceptInvitationError = false
      SpinnerService.setSpinner(true)
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.ACCEPT_LEAGUE_INVITATION.path}`
      axios.post(path, { leagueId: this.currentLeagueToJoin.leagueId }, { headers: this.getHeader(this.token) })
        .then(async (resp) => {
          if (resp.data === ApiErrorMessages.LEAGUE.JOIN_FAIL ||
              resp.data === ApiErrorMessages.LEAGUE.LEAGUES_NOT_FOUND ||
              resp.data === ApiErrorMessages.USER.NOT_FOUND ||
              resp.data === ApiErrorMessages.LEAGUE.USER_NOT_INVITED) {
            this.showAcceptInvitationError = true
          } else {
            this.hideModal(this.modals.acceptInvitation)
            this.showAcceptInvitationError = false
            try {
              await this.handleUserResponse(resp.data)
            } catch (err) {}
          }
          SpinnerService.setSpinner(false)
        })
        .catch(() => {
          this.showModal(this.modals.acceptInvitationError)
        })
    },
    async handleUserResponse (user) {
      this.user = this.createUserToSave(user)
      localStorage.setItem(
        localStorageKeys.NFL_TIPPER_USER,
        JSON.stringify(this.user)
      )
      try {
        await this.getUserLeagues()
      } catch (err) {}
    },
    onSelectLeague (leagueId) {
      this.$router.push({ name: Routes.LEAGUE.name, params: { leagueId: leagueId } })
    },
    showModal (modal, league) {
      if (modal === this.modals.createLeague) {
        setTimeout(() => {
          this.$nextTick(function () {
            this.$refs.newLeagueInput.$el.focus()
          })
        })
      }
      this.showCreateLeagueError = false
      this.showAcceptInvitationError = false
      this.currentLeagueToJoin = league
      this.$modal.show(modal)
    },
    hideModal (modal) {
      this.$modal.hide(modal)
    },
    async getUser () {
      SpinnerService.setSpinner(true)
      try {
        const userResponse = await axios.post(
          `${process.env.VUE_APP_BASE_URL}${ApiRoutes.GET_USER.path}`,
          {},
          { headers: this.getHeader(this.token) }
        )
        if (userResponse.data === ApiErrorMessages.USER.NOT_FOUND) {
          localStorage.removeItem(localStorageKeys.NFL_TIPPER_TOKEN)
          localStorage.removeItem(localStorageKeys.NFL_TIPPER_USER)
          SpinnerService.setSpinner(false)
          this.$router.push(Routes.LOGIN.path)
          return
        }
        this.handleUserResponse(userResponse.data)
      } catch (err) {
        return
      }
      await this.getUserLeagues()
      SpinnerService.setSpinner(false)
    },
    async getUserLeagues () {
      SpinnerService.setSpinner(true)
      const leagueIds = []
      this.user.leagues.forEach(league => {
        leagueIds.push(league.leagueId)
      })
      try {
        const leaguesResponse = await axios.post(
          `${process.env.VUE_APP_BASE_URL}${ApiRoutes.GET_LEAGUES.path}`,
          { leagueIds: leagueIds },
          { headers: this.getHeader(this.token) }
        )
        this.userLeagues = leaguesResponse.data
      } catch (err) {}
      SpinnerService.setSpinner(false)
    },
    reloadPage () {
      this.hideModal(this.modals.unexpectedError)
      this.$router.push(Routes.LEAGUES.path)
    }
  },
  mounted () {
    this.token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
    this.getUser()
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
.button-margin-0-20 {
  margin: 0px 20px 20px 20px;
}
.leagues-header {
  font-size: 26px;
}
.button {
  background-color: rgb(65, 134, 83) !important;
  text-transform: none
}
.invitation-button {
  background-color: rgb(88, 186, 199) !important;
}
.container {
  margin: 30px auto;
  background-color: $bg-grey !important;
}
.invitation-card {
  padding: 10px;
  margin-bottom: 20px;
}
.invitation-header {
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: bold;
}
.leagues-card {
  margin-left: 5%;
}
.modal-headers {
  margin-bottom: 20px;
}
.accept-invitation {
  background-color: rgb(46, 212, 46) !important;
  border-color: rgb(46, 212, 46) !important;
  color: rgb(255, 255, 255);
  padding: 6px;
  width: 88px;
  border-radius: 2px;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
}
.accept-invitation:hover {
  background-color: rgb(30, 172, 30) !important;
  border-color: rgb(30, 172, 30) !important;
}
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin-left: 20px;
}
.avatar {
  max-width: 50px;
  max-height: 50px;
}
.league-card {
  width: 90%;
  margin: 10px auto;
  height: 60px;
  background-color: rgba(207, 206, 203, 0.5);
  cursor: pointer;
}
.league-card:hover {
  background-color: rgb(207, 206, 203);
}
.league-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.league-name {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}
</style>
