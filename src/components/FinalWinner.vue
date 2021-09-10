<template>
  <div class="container">
    <md-card v-if="!showFinalWinners">
      <div class="header">Select your superbowl winner team</div>
      <div class="result-and-dropdown">
        <div v-if="finalWinner">
          <img :src="require(`../assets/team-logos/png/${finalWinner}.png`)" class="logo">
        </div>

        <md-field v-if="options.length" class="teams-dropdown">
          <md-select
            v-model="finalWinner"
            placeholder="Select a team"
            :disabled="showFinalWinners">
            <md-option
              v-for="option of options" :key="option.value"
              :value="option.value">
              {{ option.title }}
            </md-option>
          </md-select>
        </md-field>

      </div>
      <md-button
        class="md-primary md-raised material-button"
        @click="onSaveWinner">
        Save
      </md-button>

    </md-card>

    <md-card v-if="showFinalWinners" class="final-winners-card">
      <div class="final-winner-header">Final winners</div>
      <div
        v-for="(userId, index) of Object.keys(finalWinnerBets)"
        :key="userId"
        class="final-winner-container"
        :class="{ 'line-separator': index !== 0 }">
        <div>{{ getUsername(userId) }}</div>
        <img
          v-if="finalWinnerBets[userId]"
          :src="require(`../assets/team-logos/png/${finalWinnerBets[userId]}.png`)" class="logo">
      </div>
    </md-card>

    <modal name="bet-save-error-modal" width="400" height="auto">
      <div class="modal-container">
        <div class="margin-bottom-30">
          There was an error while trying to save your final winner. Please try again!
        </div>
        <md-button class="md-primary md-raised material-button" @click="hideModal">Ok</md-button>
      </div>
    </modal>

  </div>
</template>

<script>
import localStorageKeys from '../constants/localStorageKeys'
import Teams from '../constants/teams'
import * as axios from 'axios'
import SpinnerService from '../services/SpinnerService'
import { ApiRoutes } from '../utils/ApiRoutes'
import utilsMixin from '../mixins/utils'
import ResponseMessages from '../constants/api-response-messages'

export default {
  name: 'FinalWinner',
  mixins: [utilsMixin],
  props: {
    leagueId: String,
    winnerTeam: String,
    showFinalWinners: Boolean,
    finalWinnerBets: Object,
    players: Array
  },
  data () {
    return {
      finalWinner: null,
      teams: Teams,
      options: [],
      token: null
    }
  },
  methods: {
    async onSaveWinner () {
      if (!this.finalWinner) {
        return
      }
      SpinnerService.setSpinner(true)
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.SAVE_FINAL_WINNER.path}`
      try {
        const result = await axios.post(
          path,
          { leagueId: this.leagueId, finalWinner: this.finalWinner },
          { headers: this.getHeader(this.token) }
        )
        if (result === ResponseMessages.LEAGUE.UPDATE_FAIL) {
          this.showModal()
        }
        SpinnerService.setSpinner(false)
      } catch (err) {
        this.showModal()
        SpinnerService.setSpinner(false)
      }
    },
    showModal () {
      this.$modal.show('bet-save-error-modal')
    },
    hideModal () {
      this.$modal.hide('bet-save-error-modal')
    },
    setTeams () {
      Teams.forEach(team => {
        this.options.push({
          title: team.label,
          value: team.value
        })
      })
    },
    getUsername (id) {
      return this.players.find(player => player.id === id).name
    }
  },
  mounted () {
    this.finalWinner = this.winnerTeam
    this.token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
    this.setTeams()
  }
}
</script>

<style lang="scss">
@import '../styles/_variables.scss';
.container {
  padding: 20px;
  background-color: $bg-grey
}
.header {
  padding-top: 10px;
  font-size: 15px;
}
.logo {
  max-width: 60px;
  max-height: 40px;
  margin: 0px 5px;
}
.select-option {
  display: flex;
}
.result-and-dropdown {
  display: flex;
  align-items: center;
  padding: 5px;
}
.teams-dropdown {
  margin: 0px 10px;
}
.final-winners-card {
  padding: 12px;
}
.final-winner-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
}
.final-winner-header {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
}
.line-separator {
  border-top: 1px solid black;
  height: 42px;
}
</style>
