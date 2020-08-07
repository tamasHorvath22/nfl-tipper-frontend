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
              <div class="team-container left-team">
                <img :src="require(`../assets/team-logos/${game.awayTeamAlias}.gif`)" class="logo">

                <md-button
                  class="md-raised material-button strong-font-color"
                  :class="getTeamButtonColor(game, game.awayTeamAlias, teamBet.AWAY)"
                  :disabled="isGameDisabled(game)"
                  @click="onBet(game, teamBet.AWAY)">
                  {{ getTeamLabel(game.awayTeamAlias) }}
                </md-button>
                <div v-if="game.awayScore" class="score">{{ game.awayScore }}</div>
              </div>

              <i class="fa fa-at at-icon" aria-hidden="true"></i>

              <div class="team-container right-team">
                <div v-if="game.homeScore" class="score">{{ game.homeScore }}</div>
                <md-button
                  class="md-raised material-button strong-font-color"
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
      // TODO uncomment this for production
      // const now = new Date().getTime()
      // const isAfterDeadline = now > new Date(game.startTime).getTime()
      // return !this.selectedWeek.isOpen || isAfterDeadline
      return !this.selectedWeek.isOpen || !game.isOpen
    },
    onSaveBets () {
      SpinnerService.setSpinner(true)
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.SAVE_BETS.path}`
      axios.post(path, { leagueId: this.leagueId, week: this.selectedWeek }, { headers: this.headers })
        .then(resp => {
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
        return this.teamSelectedClass(game, bet)
      } else {
        if (game.winner) {
          const isWinnerTeam = team === game.winnerTeamAlias
          if (game.winner === this.teamBet.TIE) {
            return 'tie'
          }
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
          return this.teamSelectedClass(game, bet)
        }
      }
    },
    teamSelectedClass (game, bet) {
      if (this.isThisTeamSelected(game, bet)) {
        return 'active-team-selected'
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
      'Access-Control-Allow-Origin': '*',
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
  background-color: $bg-grey;
}
.selector-container {
  margin: auto;
  display: flex;
  justify-content: center;
}
.select {
  background-color: $bg-grey;
}
.selector {
  margin: 10px;
}
.at-icon {
  font-size: 20px;
  margin-top: 14px;
}
.logo {
  margin-top: 8px;
  max-width: 60px;
  max-height: 40px;
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
  width: 190px;
  display: flex;
}
.left-team {
  justify-content: flex-end;
  padding-right: 10px;
}
.right-team {
  padding-left: 10px;
}
.score {
  font-size: 20px;
  font-weight: bold;
  padding-top: 13px;
  min-width: 25px;
}
.strong-font-color {
  color: black !important;
}
.active-team-selected {
  background-color: rgb(94, 202, 245) !important;
}
.team-success {
  background-color: rgb(75, 190, 75) !important;
}
.team-fail {
  background-color: rgb(219, 55, 77) !important;
}
.tie {
  background-color: rgb(230, 187, 193) !important;
}
</style>
