<template>
  <div class="md-layout">
    <div v-if="league" class="md-layout-item md-size-100 league-header">
      {{ league.name }}
    </div>
    <div v-if="league" class="md-layout-item md-size-20">
      <div>
        <modal name="modal" width="400" height="180">
          <div class="modal-container">
            <div class="invite-modal-header">Type your friend's email</div>
            <md-field class="email-field">
              <md-input
                name="email"
                placeholder="here..."
                v-validate="{ required: true, validEmail: true }"
                v-model="invitedEmail"/>
            </md-field>
            <md-button class="md-primary md-raised create-league-button material-button" @click="onInvite">Invite</md-button>
            <div v-if="showInvalidEmailError" class="error-message">This email is not valid</div>
            <div v-if="noUserFound" class="error-message">No user found by this email</div>
            <div v-if="noLeagueFound" class="error-message">No league found, please try again!</div>
            <div v-if="userAlreadyInLeague" class="error-message">This user is already in the league.</div>
            <div v-if="userAlreadyInvited" class="error-message">This user is already invited.</div>
            <div v-if="errorWhileInvitation" class="error-message">There was an error during invitation. Please try again!</div>
          </div>
        </modal>

        <md-button v-if="isOwner" class="md-primary md-raised create-league-button material-button" @click="showModal">Invite player</md-button>
        <div>
          Standings
          <div v-for="player in standings" :key="player.id">
            <div>{{ player.name }} - {{ player.score }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ApiRoutes } from '../utils/ApiRoutes'
import * as axios from 'axios'
import localStorageKeys from '../constants/localStorageKeys'
import SpinnerService from '../services/SpinnerService'
import validationMixin from '../mixins/validationMixin'
import ApiErrorMessages from '../constants/api-response-messages'

export default {
  name: 'League',
  mixins: [validationMixin],
  data () {
    return {
      headers: null,
      leagueId: null,
      league: null,
      standings: null,
      invitedEmail: null,
      isModalOpen: null,
      showInvalidEmailError: false,
      noUserFound: false,
      noLeagueFound: false,
      userAlreadyInLeague: false,
      userAlreadyInvited: false,
      errorWhileInvitation: false,
      isOwner: null
    }
  },
  methods: {
    getLeague () {
      SpinnerService.setSpinner(true)
      this.leagueId = this.$route.params.leagueId
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.GET_LEAGUE.path}`
      axios.post(path, { leagueId: this.leagueId }, { headers: this.headers })
        .then(league => {
          this.league = league.data
          this.isOwner = this.league.creator === this.user.userId
          this.standings = this.league.seasons.find(season => season.isCurrent).standings
          this.standings.sort((a, b) => {
            return a.score > b.score ? -1 : 1
          })
          SpinnerService.setSpinner(false)
        })
    },
    onInvite () {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.hideAllErrorMessages()
          SpinnerService.setSpinner(true)
          const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.LEAGUE_INVITATION.path}`
          axios.post(path, { leagueId: this.leagueId, invitedEmail: this.invitedEmail }, { headers: this.headers })
            .then(resp => {
              if (resp.data === ApiErrorMessages.USER.NO_EMAIL_FOUND) {
                this.noUserFound = true
              } else if (resp.data === ApiErrorMessages.LEAGUE.LEAGUES_NOT_FOUND) {
                this.noLeagueFound = true
              } else if (resp.data === ApiErrorMessages.LEAGUE.USER_ALREADY_IN_LEAGUE) {
                this.userAlreadyInLeague = true
              } else if (resp.data === ApiErrorMessages.LEAGUE.USER_ALREADY_INVITED) {
                this.userAlreadyInvited = true
              } else if (resp.data === ApiErrorMessages.LEAGUE.INVITATION_SUCCESS) {
                this.hideModal()
              } else {
                this.errorWhileInvitation = true
              }
              SpinnerService.setSpinner(false)
            })
        } else {
          this.showInvalidEmailError = true
        }
      })
    },
    hideAllErrorMessages () {
      this.showInvalidEmailError = false
      this.noUserFound = false
      this.noLeagueFound = false
      this.userAlreadyInLeague = false
      this.userAlreadyInvited = false
      this.errorWhileInvitation = false
    },
    showModal () {
      this.$modal.show('modal')
    },
    hideModal () {
      this.$modal.hide('modal')
    }
  },
  mounted () {
    this.token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
    this.user = JSON.parse(localStorage.getItem(localStorageKeys.NFL_TIPPER_USER))
    this.headers = {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + this.token
    }
    this.getLeague()
  }
}

</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';

.email-field {
  width: 80%;
  margin: auto;
}

.invite-modal-header {
  font-size: 20px;
}

.league-header {
  margin: 30px 0px;
  font-size: 30px;
  font-weight: bold;
}
</style>
