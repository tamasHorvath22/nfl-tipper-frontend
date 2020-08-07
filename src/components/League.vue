<template>
  <div class="font-color">
    <div v-if="league" class="md-layout">
      <div class="md-layout-item md-size-100">
        <md-card class="md-layout-item md-size-40 md-small-size-90 header-container">
          <md-button v-if="isOwner" class="md-primary md-raised create-league-button material-button" @click="showModal">Invite player</md-button>
          <div class="header">{{ league.name }}</div>
        </md-card>
      </div>
      <div class="md-layout md-layout-item md-size-100">

        <div v-if="season" class="md-layout-item md-size-40 md-small-size-90 card-margin">
          <Standings :standings="season.standings"/>
        </div>

        <div class="md-layout-item md-size-45 md-small-size-90 card-margin margin-right-5">
          <Game
            :season="league.seasons[0]"
            :players="league.players"
            :leagueId="league._id"
            class="game"/>
        </div>
      </div>

      <div v-if="league" class="md-layout-item md-size-20">
        <modal name="modal" width="400" height="180">
          <div class="modal-container">
            <div class="invite-modal-header header">Type your friend's email</div>
            <md-field class="email-field">
              <md-input
                name="email"
                placeholder="here..."
                autofocus
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
import Standings from '../components/Standings'
import Game from '../components/Game'

export default {
  name: 'League',
  mixins: [validationMixin],
  components: {
    Standings,
    Game
  },
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
      isOwner: null,
      season: null
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
      this.hideAllErrorMessages()
      this.$validator.validateAll().then(valid => {
        if (valid) {
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
    },
    getSeason () {
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.GET_SEASON.path}`
      axios.post(path, { leagueId: this.leagueId }, { headers: this.headers })
        .then(resp => {
          this.season = resp.data
        })
    }
  },
  mounted () {
    this.token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
    this.user = JSON.parse(localStorage.getItem(localStorageKeys.NFL_TIPPER_USER))
    this.headers = {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + this.token,
      'Access-Control-Allow-Origin': '*'
    }
    this.getLeague()
    this.getSeason()
  }
}

</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';
.header-container {
  padding: 10px;
  margin: 30px auto;
  display: flex;
  align-items: center;
}
.header {
 margin: auto;
}
.font-color {
  color: rgb(255, 255, 255);
}
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
.header {
  color: black;
  font-size: 30px;
  font-weight: 600;
}
.card-margin {
  margin-left: 5%;
  margin-top: 30px;
}
.margin-right-5 {
  margin-right: 5%;
}
.game {
  margin-bottom: 30px;
}
</style>
