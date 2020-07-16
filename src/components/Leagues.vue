<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100 league-header">
      {{ league.name }}
    </div>
    <div v-if="league" class="md-layout-item md-size-20">
      <div>
        <modal name="modal" width="400" height="200">
          <div class="modal-container">
            <div class="invite-modal-header">Type your friend's email</div>
            <md-field class="email-field">
              <md-input
                name="email"
                placeholder="here..."
                v-validate="{ required: true, validEmail: true }"
                v-model="invitedEmail"/>
            </md-field>
            <md-button class="md-primary md-raised create-league-button" @click="onInvite">Invite</md-button>
            <div v-if="showInvalidEmailError" class="error-message">This email is not valid</div>
          </div>
        </modal>

        <md-button class="md-primary md-raised create-league-button" @click="showModal">Invite</md-button>
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

export default {
  name: 'Leagues',
  mixins: [validationMixin],
  data () {
    return {
      headers: null,
      leagueId: null,
      league: null,
      standings: null,
      invitedEmail: null,
      isModalOpen: null,
      showInvalidEmailError: false
    }
  },
  methods: {
    getLeague () {
      this.leagueId = this.$route.params.leagueId
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.GET_LEAGUE.path}`
      axios.post(path, { leagueId: this.leagueId }, { headers: this.headers })
        .then(league => {
          this.league = league.data
          console.log(this.league)
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
          this.hideModal()
          this.showInvalidEmailError = false
          SpinnerService.setSpinner(true)
          const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.LEAGUE_INVITATION.path}`
          axios.post(path, { leagueId: this.leagueId, invitedEmail: this.invitedEmail }, { headers: this.headers })
            .then(resp => {
              console.log(resp)
              SpinnerService.setSpinner(false)
            })
        } else {
          this.showInvalidEmailError = true
        }
      })

      // TODO, continue
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
    this.headers = {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + this.token
    }
    SpinnerService.setSpinner(true)
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

.modal-container {
  margin: 30px;
}

.league-header {
  margin: 30px 0px;
  font-size: 30px;
  font-weight: bold;
}
</style>
