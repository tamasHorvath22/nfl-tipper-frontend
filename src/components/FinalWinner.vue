<template>
  <div class="container">
    <md-card>
      <div class="header">Select your superbowl winner team</div>
      <div class="result-and-dropdown">
        <div v-if="finalWinner">
          <img :src="require(`../assets/team-logos/${finalWinner}.gif`)" class="logo">
        </div>

        <md-field v-if="options.length" class="teams-dropdown">
          <md-select
            v-model="finalWinner"
            placeholder="Select a team"
            :disabled="!isOpen">
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
    isOpen: Boolean
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
      } catch (err) {
        console.error(err)
        this.showModal()
      }
      SpinnerService.setSpinner(false)
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
          value: team.value,
          img: require(`../assets/team-logos/${team.value}.gif`)
        })
      })
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
.team-name {
  display: flex;
  align-items: center;
  padding-left: 10px;
}
.teams-dropdown {
  margin: 0px 10px;
}
</style>
