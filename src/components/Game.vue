<template>
  <div>
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
                  v-for="week of season.weeks" :key="week.number"
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
          <md-card v-for="game in selectedWeek.games" :key="game._id" class="game-container">
            <div class="inner-game-container">
              <div class="team-container left-team">
                <div class="image-and-button-left">
                  <div class="logo-and-button">
                    <div class="team-logo-container">
                      <img :src="require(`../assets/team-logos/${game.awayTeamAlias}.gif`)" class="logo">
                    </div>
                    <md-button
                      class="md-raised material-button strong-font-color"
                      :class="getTeamButtonColor(game, game.awayTeamAlias, teamBet.AWAY)"
                      :disabled="isGameDisabled(game)"
                      @click="onBet(game, teamBet.AWAY)">
                      {{ getTeamLabel(game.awayTeamAlias) }}
                    </md-button>
                  </div>
                  <div v-if="notNullOrUndefinded(game.awayScore)" class="score">{{ game.awayScore }}</div>
                </div>
              </div>

              <i class="fa fa-at at-icon" aria-hidden="true"></i>

              <div class="team-container right-team">
                <div class="image-and-button-right">
                  <div v-if="notNullOrUndefinded(game.homeScore)" class="score">{{ game.homeScore }}</div>
                  <div class="logo-and-button">
                    <md-button
                      class="md-raised material-button strong-font-color"
                      :class="getTeamButtonColor(game, game.homeTeamAlias, teamBet.HOME)"
                      :disabled="isGameDisabled(game)"
                      @click="onBet(game, teamBet.HOME)">
                      {{ getTeamLabel(game.homeTeamAlias) }}
                    </md-button>
                    <div class="team-logo-container">
                      <img :src="require(`../assets/team-logos/${game.homeTeamAlias}.gif`)" class="logo">
                    </div>
                  </div>
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
      isForAllLeagues: false
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
    async onSaveBets () {
      SpinnerService.setSpinner(true)
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.SAVE_BETS.path}`
      try {
        await axios.post(
          path,
          { leagueId: this.leagueId, week: this.selectedWeek, isForAllLeagues: this.isForAllLeagues },
          { headers: this.getHeader(this.token) }
        )
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      } catch (err) {
        this.showModal()
      }
      SpinnerService.setSpinner(false)
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
          if (!game.bets.find(bet => bet.id === this.selectedPlayer)) {
            if (!isWinnerTeam) {
              return 'team-fail'
            }
            return
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
        this.selectedPlayer = this.user.userId
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
  display: flex;
  align-items: center;
  font-size: 20px;
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
  min-width: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  display: flex;
}
.image-and-button-right {
  display: flex;
}
.logo-and-button {
  display: flex;
}
.team-logo-container {
  width: 100%;
  margin: auto;
}
.logo {
  max-width: 60px;
  max-height: 40px;
  margin: auto;
}
@media(max-width: 1024px){
  .logo-and-button {
    display: block;
  }
}
@media(max-width: 600px){
  .avatar-container {
    width: 80px;
    height: 80px;
  }
  .avatar {
    max-width: 80px;
    max-height: 80px;
  }
}
</style>
