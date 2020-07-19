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

        <modal :name="modals.createLeague" width="400" height="auto">
          <div class="modal-container">
            <div class="invite-modal-header">Type the name of your league</div>
            <md-field>
              <md-input
                name="newLeague"
                placeholder="here..."
                v-model="newLeagueName"/>
            </md-field>
            <md-button class="md-raised create-league-button" @click="hideModal(modals.createLeague)">Close</md-button>
            <md-button class="md-primary md-raised create-league-button" @click="onCreateLeague">Create</md-button>
            <div v-if="showCreateLeagueError" class="error-message">There was an error while creating your league. Please try again!</div>
          </div>
        </modal>

        <md-card-header>
          <div class="leagues-header">My leagues</div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-size-25 md-small-size-100">
              <md-button class="md-primary md-raised create-league-button" @click="showModal(modals.createLeague)">Create league</md-button>
              <div v-if="user">
                <div>Invitations</div>

                <modal :name="modals.acceptInvitation" width="400" height="auto">
                  <div class="modal-container">
                    <div
                      class="invite-modal-header"
                      v-if="currentLeagueToJoin">
                        Do you accept the invitation to "{{ currentLeagueToJoin.name }}" league?
                      </div>
                    <md-button class="md-raised create-league-button" @click="hideModal(modals.acceptInvitation)">No</md-button>
                    <md-button class="md-primary md-raised create-league-button" @click="onAcceptInvitation">Yes</md-button>
                    <div
                      v-if="showAcceptInvitationError"
                      class="error-message">
                        There was an error while joining the league. Please try again!
                    </div>
                  </div>
                </modal>

                <div v-for="inv of user.invitations" :key="inv.leagueId">
                  <md-button
                    class="md-primary md-raised create-league-button"
                    @click="showModal(modals.acceptInvitation, inv)">
                      {{ inv.name }}
                  </md-button>
                </div>
              </div>
            </div>
            <div v-if="user" class="md-layout-item md-size-75 md-small-size-100">
              <div v-for="league in user.leagues" :key="league.leagueId">
                <md-button
                  class="md-raised submit-button"
                  @click="onSelectLeague(league.leagueId)">
                  {{ league.name }}
                </md-button>
              </div>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </div>

  </div>
</template>

<script>
import localStorageKeys from '../constants/localStorageKeys'
import * as axios from 'axios'
import { ApiRoutes } from '../utils/ApiRoutes'
import SpinnerService from '../services/SpinnerService'
import { Routes } from '../utils/Routes'
import ApiErrorMessages from '../constants/api-response-messages'

export default {
  name: 'Profile',
  data () {
    return {
      modals: {
        acceptInvitation: 'accept-invitation-modal',
        createLeague: 'create-league'
      },
      user: null,
      token: null,
      isUserDataDisabled: true,
      headers: null,
      isModalOpen: false,
      newLeagueName: null,
      currentLeagueToJoin: null,
      showCreateLeagueError: false,
      showAcceptInvitationError: false
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
    onCreateLeague () {
      SpinnerService.setSpinner(true)
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.CREATE_LEAGUE.path}`
      axios.post(path, { name: this.newLeagueName, leagueAvatarUrl: null }, { headers: this.headers })
        .then(resp => {
          if (resp.data === ApiErrorMessages.LEAGUE.CREATE_FAIL) {
            this.showCreateLeagueError = true
          } else {
            this.hideModal(this.modals.createLeague)
            this.handleUserResponse(resp.data)
          }
          SpinnerService.setSpinner(false)
        })
    },
    onAcceptInvitation () {
      this.showAcceptInvitationError = false
      SpinnerService.setSpinner(true)
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.ACCEPT_LEAGUE_INVITATION.path}`
      axios.post(path, { leagueId: this.currentLeagueToJoin.leagueId }, { headers: this.headers })
        .then(resp => {
          if (resp.data === ApiErrorMessages.LEAGUE.JOIN_FAIL) {
            this.showAcceptInvitationError = true
          } else {
            this.hideModal(this.modals.acceptInvitation)
            this.showAcceptInvitationError = false
            this.handleUserResponse(resp.data)
          }
          SpinnerService.setSpinner(false)
        })
    },
    handleUserResponse (user) {
      const userToSave = {
        username: user.username,
        userId: user._id,
        email: user.email,
        leagues: user.leagues,
        invitations: user.invitations
      }
      this.user = userToSave
      localStorage.setItem(localStorageKeys.NFL_TIPPER_USER, JSON.stringify(userToSave))
    },
    onSelectLeague (leagueId) {
      this.$router.push({ name: Routes.LEAGUES.name, params: { leagueId: leagueId } })
    },
    showModal (modal, league) {
      this.showCreateLeagueError = false
      this.showAcceptInvitationError = false
      this.currentLeagueToJoin = league
      this.$modal.show(modal)
    },
    hideModal (modal) {
      this.$modal.hide(modal)
    }
  },
  mounted () {
    this.user = JSON.parse(localStorage.getItem(localStorageKeys.NFL_TIPPER_USER))
    this.token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
    this.headers = {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + this.token
    }
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
