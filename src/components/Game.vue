<template>
  <md-card class="outer-card">
    <div class="md-layout">
      <div class="week-player-options">

        <div class="avatar-container">
          <img :src="getCurrentPlayerAvatar()" class="avatar">
        </div>

        <div class="selector-container">
          <md-field v-if="season">
            <md-select v-model="selectedWeekNumber">
              <md-option
                v-for="week of season.weeks" :key="week.id"
                :value="week.number">
                {{ getWeekLabel(week.number) }}
              </md-option>
            </md-select>
          </md-field>

          <md-field>
            <md-select v-model="selectedPlayer" :disabled="isPlayerSelectDisabled">
              <md-option
                v-for="player of players" :key="player.id"
                :value="player.id">
                {{ player.name }}
              </md-option>
            </md-select>
          </md-field>
        </div>
      </div>

      <div v-if="selectedWeek" class="md-layout-item md-size-100">
        <md-card v-for="game in selectedWeek.games" :key="game.id" class="game-container">
          <div class="inner-game-container">
            <div class="team-container left-team">
              <div class="team-logo-container">
                <div class="logo-name-standings logo-name-standings-mobile-left">
                  <img
                    :src="require(`../assets/team-logos/png/${game.awayTeamAlias}.png`)"
                    class="team-logo">
                  <div class="logo-and-name-container">
                    <div class="team-name">{{ getTeamLabel(game.awayTeamAlias) }}</div>
                    <div
                      v-if="teamStandings"
                      class="standing-values">
                      ({{ getTeamStandingLabel(game.awayTeamAlias) }})
                    </div>
                  </div>
                </div>
                <div
                  :class="{ 'invisible': !notNullOrUndefinded(game.awayScore) }"
                  class="score">
                  {{ game.awayScore }}
                </div>
              </div>
              <div
                class="bet-buttons-container"
                :class="getBetButtonContainerColor(game, game.awayTeamAlias)">
                <md-button
                  v-for="button of betButtons.AWAY"
                  :key="button.value"
                  :disabled="isGameDisabled(game)"
                  class="md-raised material-button strong-font-color"
                  :class="getTeamButtonColor(game, game.awayTeamAlias, button.value)"
                  @click="onBet(game, button.value)">
                  {{ button.label }}
                </md-button>

              </div>
            </div>

            <i class="fa fa-at at-icon" aria-hidden="true"></i>

            <div class="team-container right-team">
              <div class="team-logo-container">
                <div
                  :class="{ 'invisible': !notNullOrUndefinded(game.awayScore) }"
                  class="score">
                  {{ game.homeScore }}
                </div>
                <div class="logo-name-standings logo-name-standings-mobile-right">
                  <div class="logo-and-name-container">
                    <div class="team-name">{{ getTeamLabel(game.homeTeamAlias) }}</div>
                    <div
                      v-if="teamStandings"
                      class="standing-values">
                      ({{ getTeamStandingLabel(game.homeTeamAlias) }})
                    </div>
                  </div>
                  <img
                    :src="require(`../assets/team-logos/png/${game.homeTeamAlias}.png`)"
                    class="team-logo">
                </div>
              </div>

              <div
                class="bet-buttons-container"
                :class="getBetButtonContainerColor(game, game.homeTeamAlias)">
                <md-button
                  v-for="button of betButtons.HOME"
                  :key="button.value"
                  :disabled="isGameDisabled(game)"
                  class="md-raised material-button strong-font-color"
                  :class="getTeamButtonColor(game, game.homeTeamAlias, button.value)"
                  @click="onBet(game, button.value)">
                  {{ button.label }}
                </md-button>
              </div>

            </div>
          </div>
          <div>{{ getStartTime(game.startTime) }}</div>
        </md-card>
        <md-checkbox
          v-if="hasMoreLeagues"
          v-model="isForAllLeagues"
          class="md-primary">
          Save bets for all of my leagues
        </md-checkbox>
        <md-button
          v-if="selectedWeek && selectedWeek.isOpen"
          class="md-primary md-raised material-button"
          @click="onSaveBets">
          Save bets
        </md-button>

        <modal name="bet-save-error" width="400" height="auto">
          <div class="modal-container">
            <div class="margin-bottom-30">
              There was an error while trying to save your bets. Please try again!
            </div>
            <md-button class="md-primary md-raised material-button" @click="hideModal">Ok</md-button>
          </div>
        </modal>

      </div>
    </div>
  </md-card>
</template>

<script>
import localStorageKeys from '../constants/localStorageKeys'
import teamNamesMixin from '../mixins/teamNamesMixin'
import teamBet from '../constants/team-bet'
import SpinnerService from '../services/SpinnerService'
import { ApiRoutes } from '../utils/ApiRoutes'
import * as axios from 'axios'
import utilsMixin from '../mixins/utils'
import BetButtons from '../constants/bet.buttons'
import jwtDecode from 'jwt-decode'

export default {
  name: 'Game',
  mixins: [teamNamesMixin, utilsMixin],
  props: {
    season: Object,
    players: Array,
    leagueId: String,
    hasMoreLeagues: Boolean
  },
  data () {
    return {
      selectedWeekNumber: null,
      selectedWeek: null,
      selectedPlayer: null,
      user: null,
      teamBet: teamBet,
      isPlayerSelectDisabled: false,
      isForAllLeagues: false,
      teamStandings: null,
      betButtons: BetButtons
    }
  },
  methods: {
    setLastWeekAsSelectedWeek () {
      this.selectedWeek = this.season.weeks[this.season.weeks.length - 1]
      this.selectedWeekNumber = this.selectedWeek.number
      this.sortGames()
      if (this.selectedWeek.isOpen) {
        this.isPlayerSelectDisabled = true
      }
    },
    sortGames () {
      this.selectedWeek.games.sort((a, b) => {
        return new Date(a.startTime).getTime() > new Date(b.startTime).getTime() ? 1 : -1
      })
    },
    setDefaultPlayer () {
      const token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
      this.user = jwtDecode(token)
      this.selectedPlayer = this.user.id
    },
    onBet (game, bet) {
      const userBet = game.bets.find(bet => bet.id === this.user.id)
      userBet.bet = bet
    },
    isThisTeamSelected (game, bet) {
      const userBet = game.bets.find(bet => bet.id === this.selectedPlayer)
      return userBet.bet === bet
    },
    isGameDisabled (game) {
      // TODO uncomment this for production
      const now = new Date().getTime()
      const isAfterDeadline = now > new Date(game.startTime).getTime()
      return !this.selectedWeek.isOpen || isAfterDeadline
      // return !this.selectedWeek.isOpen || !game.isOpen
    },
    async onSaveBets () {
      const bets = this.selectedWeek.games.map(game => ({ gameId: game.gameId, bet: game.bets.find(bet => bet.id === this.user.id).bet }))

      SpinnerService.setSpinner(true)
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.SAVE_BETS.path}`
      try {
        await axios.post(
          path,
          {
            leagueId: this.leagueId,
            weekId: this.selectedWeek.weekId,
            bets: bets,
            isForAllLeagues: this.isForAllLeagues
          },
          { headers: this.getHeader(this.token) }
        )
        SpinnerService.setSpinner(false)
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      } catch (err) {
        this.showModal()
        SpinnerService.setSpinner(false)
      }
    },
    async getTeamStandings () {
      SpinnerService.setSpinner(true)
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.GET_TEAMS_STANDINGS.path}`
      try {
        const response = await axios.get(path, { headers: this.getHeader(this.token) })
        this.teamStandings = response.data.teams
        SpinnerService.setSpinner(false)
      } catch {
        SpinnerService.setSpinner(false)
      }
    },
    getTeamStandingLabel (teamAlias) {
      if (this.teamStandings) {
        const teamData = this.teamStandings[teamAlias]
        return `${teamData.win} - ${teamData.loss} - ${teamData.tie}`
      }
    },
    getStartTime (timeStamp) {
      const date = new Date(timeStamp)
      const day = `${this.getDayName(date.getDay())}, ${this.getMonthName(date.getMonth())} ${this.twoDigits(date.getDate())}.`
      const time = `${this.twoDigits(date.getHours())}:${this.twoDigits(date.getMinutes())}`
      return `${day} ${time}`
    },
    getBetButtonContainerColor (game, teamAlias) {
      if (!game.isOpen) {
        const userBet = game.bets.find(bet => bet.id === this.selectedPlayer)
        if (game.winner === teamBet.TIE) {
          if (userBet.bet === BetButtons.HOME[0].value || userBet.bet === BetButtons.AWAY[0].value) {
            return 'nailed-winner'
          } else {
            return 'missed-winner'
          }
        }
        const userBetTeam = userBet.bet.substring(0, 4) === 'HOME' ? game.homeTeamAlias : game.awayTeamAlias
        if (userBetTeam !== teamAlias) {
          return null
        }
        const winnerValue = game.winnerValue || game.winner

        if (userBet.bet.substring(0, 4) === winnerValue.substring(0, 4)) {
          return 'nailed-winner'
        } else {
          return 'missed-winner'
        }
      }
    },
    getTeamButtonColor (game, team, bet) {
      if (game.isOpen) {
        return this.teamSelectedClass(game, bet)
      } else {
        if (game.winner) {
          const userBet = game.bets.find(bet => bet.id === this.selectedPlayer)
          if (bet !== userBet.bet) {
            return
          }
          return game.winnerValue === userBet.bet ? 'team-success' : 'team-fail'
        } else {
          return this.teamSelectedClass(game, bet)
        }
      }
    },
    teamSelectedClass (game, bet) {
      if (this.isThisTeamSelected(game, bet)) {
        if (this.isGameDisabled(game)) {
          return 'active-team-disabled'
        }
        return 'active-team-selected'
      }
    },
    getWeekLabel (number) {
      if (number === 18) {
        return 'Wild Card'
      } else if (number === 19) {
        return 'Divisional'
      } else if (number === 20) {
        return 'Conference'
      } else if (number === 21) {
        return 'Super Bowl'
      } else {
        return `Week ${number}`
      }
    },
    getCurrentPlayerAvatar () {
      if (this.selectedPlayer) {
        const avatar = this.players.find(player => player.id === this.selectedPlayer).avatar
        return this.notNullOrUndefinded(avatar) ? avatar : require('../assets/images/nfl-logo.png')
      }
    },
    showModal () {
      this.$modal.show('bet-save-error')
    },
    hideModal () {
      this.$modal.hide('bet-save-error')
    }
  },
  watch: {
    selectedWeekNumber: function (val) {
      this.selectedWeek = this.season.weeks.find(week => week.number === val)
      this.sortGames()
      if (this.selectedWeek.isOpen) {
        this.selectedPlayer = this.user.id
      }
      this.isPlayerSelectDisabled = this.selectedWeek.isOpen
    },
    season: function (val) {
      this.setLastWeekAsSelectedWeek()
    }
  },
  mounted () {
    this.token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
    this.setDefaultPlayer()
    this.setLastWeekAsSelectedWeek()
    this.getTeamStandings()
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
  margin: 10px 30px 10px 0px;
  display: block;
  width: 55%;
}
.select {
  background-color: $bg-grey;
}
.at-icon {
  font-size: 20px;
  padding-top: 20px;
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
  display: block;
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
  min-width: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.strong-font-color {
  color: black !important;
  margin: 4px 12px !important;
}
.active-team-selected {
  background-color: rgb(94, 202, 245) !important;
}
.active-team-disabled {
  background-color: rgb(144, 176, 189) !important;
}
.team-success {
  background-color: rgb(75, 190, 75) !important;
  color: white !important;
  font-weight: bold;
}
.team-fail {
  background-color: rgb(219, 55, 77) !important;
  color: white !important;
  font-weight: bold;
}
.tie {
  background-color: rgb(230, 187, 193) !important;
}
.avatar-container {
  display: flex;
  align-items: center;
  width: 130px;
  height: 130px;
  margin-right: 10%;
}
.avatar {
  max-width: 130px;
  max-height: 130px;
}
.week-player-options {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
}
.image-and-button-left {
  display: block;
}
.team-logo-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}
.team-logo {
  margin: auto;
  width: 60px;
  height: 60px;
}
.standing {
  font-size: 10px;
  margin-top: 5px;
}
.nailed-winner {
  background-color: #c8dca9;
}
.missed-winner {
  background-color: #e9baab;
}
.logo-and-name-container {
  padding-top: 20px;
  width: 120px;
}
.bet-buttons-container {
  border-radius: 5px;
  padding: 5px;
}
.logo-name-standings {
  display: flex;
}
.team-name {
  font-size: 18px;
  font-weight: bold;
}
.standing-values {
  font-size: 12px;
}
.invisible {
  visibility: hidden;
}
@media(max-width: 1024px){}
@media(max-width: 600px){
  .avatar-container {
    width: 80px;
    height: 80px;
  }
  .avatar {
    max-width: 80px;
    max-height: 80px;
  }
  .logo-name-standings-mobile-right {
    flex-flow: column-reverse;
  }
  .logo-name-standings-mobile-left {
    display: block;
  }
  .at-icon {
    padding-top: 50px;
  }
  .game-container {
    margin-bottom: 10px;
  }
}
</style>
