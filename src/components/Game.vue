<template>
  <div>
    <md-card class="outer-card">
      <div class="md-layout">
        <md-card class="md-layout-item md-size-100 game-header">Super Bowl {{ romanize(season.numberOfSuperBowl) }}, {{ season.year }}</md-card>

        <div class="selector-container">
          <md-field class="md-layout-item selector md-size-40">
            <md-select v-model="selectedWeekNumber">
              <md-option
                v-for="week of season.weeks" :key="week.number"
                :value="week.number">
                Week {{ week.number }}
              </md-option>
            </md-select>
          </md-field>

          <md-field class="md-layout-item selector md-size-40">
            <md-select v-model="selectedPlayer" :disabled="isPlayerSelectDisabled">
              <md-option
                v-for="player of players" :key="player.id"
                :value="player.id">
                {{ player.name }}
              </md-option>
            </md-select>
          </md-field>
        </div>

        <div v-if="selectedWeek" class="md-layout-item md-size-100">
          <md-card v-for="game in selectedWeek.games" :key="game._id" class="game-container">
            <div class="inner-game-container">
              <div class="team-container">
                <img :src="require(`../assets/team-logos/${game.awayTeamAlias}.gif`)" class="logo">

                <md-button
                  class="md-raised material-button"
                  :class="getTeamButtonColor(game, game.awayTeamAlias, teamBet.AWAY)"
                  :disabled="isGameDisabled(game)"
                  @click="onBet(game, teamBet.AWAY)">
                  {{ getTeamLabel(game.awayTeamAlias) }}
                </md-button>
              </div>

              <i class="fa fa-at at-icon" aria-hidden="true"></i>

              <div class="team-container">
                <md-button
                  class="md-raised material-button"
                  :class="getTeamButtonColor(game, game.homeTeamAlias, teamBet.HOME)"
                  :disabled="isGameDisabled(game)"
                  @click="onBet(game, teamBet.HOME)">
                  {{ getTeamLabel(game.homeTeamAlias) }}
                </md-button>

                <img :src="require(`../assets/team-logos/${game.homeTeamAlias}.gif`)" class="logo">
              </div>
            </div>
            <div>{{ getStartTime(game.startTime) }}</div>
          </md-card>
          <md-button
            v-if="selectedWeek && selectedWeek.isOpen"
            class="md-primary md-raised material-button"
            @click="onSaveBets">
            Save bets
          </md-button>
        </div>

      </div>
    </md-card>
  </div>
</template>

<script>
import localStorageKeys from '../constants/localStorageKeys'
import teamNamesMixin from '../mixins/teamNamesMixin'
import teamBet from '../constants/team-bet'
import SpinnerService from '../services/SpinnerService'
import { ApiRoutes } from '../utils/ApiRoutes'
import * as axios from 'axios'
import utilsMixin from '../mixins/utils'

export default {
  name: 'Game',
  mixins: [teamNamesMixin, utilsMixin],
  props: {
    season: Object,
    players: Array,
    leagueId: String
  },
  data () {
    return {
      selectedWeekNumber: null,
      selectedWeek: null,
      selectedPlayer: null,
      user: null,
      teamBet: teamBet,
      isPlayerSelectDisabled: false
    }
  },
  methods: {
    setLastWeekAsSelectedWeek () {
      this.selectedWeek = this.season.weeks[this.season.weeks.length - 1]
      this.selectedWeekNumber = this.selectedWeek.number
      if (this.selectedWeek.isOpen) {
        this.isPlayerSelectDisabled = true
      }
    },
    setDefaultPlayer () {
      this.user = JSON.parse(localStorage.getItem(localStorageKeys.NFL_TIPPER_USER))
      this.selectedPlayer = this.user.userId
    },
    onBet (game, bet) {
      const userBet = game.bets.find(bet => bet.id === this.user.userId)
      userBet.bet = bet
    },
    isThisTeamSelected (game, bet) {
      const userBet = game.bets.find(bet => bet.id === this.selectedPlayer)
      return userBet.bet === bet
    },
    isGameDisabled (game) {
      return !this.selectedWeek.isOpen || !game.isOpen
    },
    onSaveBets () {
      SpinnerService.setSpinner(true)
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.SAVE_BETS.path}`
      axios.post(path, { leagueId: this.leagueId, week: this.selectedWeek }, { headers: this.headers })
        .then(resp => {
          console.log(resp)
          SpinnerService.setSpinner(false)
        })
    },
    getStartTime (timeStamp) {
      const date = new Date(timeStamp)
      const day = `${this.getDayName(date.getDay())}, ${this.getMonthName(date.getMonth())} ${this.twoDigits(date.getDate())}.`
      const time = `${this.twoDigits(date.getHours())}:${this.twoDigits(date.getMinutes())}`
      return `${day} ${time}`
    },
    getTeamButtonColor (game, team, bet) {
      if (this.selectedWeek.isOpen) {
        if (this.isThisTeamSelected(game, bet)) {
          return 'active-team-selected'
        }
      } else {
        if (game.winner) {
          const isWinnerTeam = team === game[`${game.winner.toLowerCase()}TeamAlias`]
          if (game.bets.find(bet => bet.id === this.selectedPlayer).bet === game.winner) {
            if (isWinnerTeam) {
              return 'team-success'
            }
          } else {
            if (!isWinnerTeam) {
              return 'team-fail'
            }
          }
        } else {
          if (this.isThisTeamSelected(game, bet)) {
            return 'active-team-selected'
          }
        }
      }
    }
  },
  watch: {
    selectedWeekNumber: function (val) {
      this.selectedWeek = this.season.weeks.find(week => week.number === val)
      if (this.selectedWeek.isOpen) {
        this.selectedPlayer = this.user.userId
      }
      this.isPlayerSelectDisabled = this.selectedWeek.isOpen
    }
  },
  mounted () {
    this.token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
    this.headers = {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + this.token
    }
    this.setDefaultPlayer()
    this.setLastWeekAsSelectedWeek()
  }
}
</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';
.game-header {
  font-size: 24px;
  font-weight: bold;
  padding: 20px;
}
.outer-card {
  padding: 20px;
  background-color: rgb(214, 214, 255);
}
.selector-container {
  margin: auto;
  display: flex;
  justify-content: center;
}
.select {
  background-color: rgb(214, 214, 255);
}
.selector {
  margin: 10px;
}
.at-icon {
  font-size: 20px;
  margin-top: 14px;
}
.logo {
  width: 50px;
  margin-top: 9px;
}
.game-container {
  margin-bottom: 20px;
  padding: 10px;
}
.inner-game-container {
  display: flex;
  justify-content: center;
}
.team-container {
  width: 170px;
}
.active-team-selected {
  background-color: rgb(94, 202, 245) !important;
}
.team-success {
  background-color: rgb(75, 190, 75) !important;
  color: black !important;
}
.team-fail {
  background-color: rgb(219, 55, 77) !important;
  color: black !important;
}
</style>
