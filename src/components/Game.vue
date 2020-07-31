<template>
  <div>
    <md-card class="card-padding">
      <div class="md-layout">
        <div class="md-layout-item md-size-100">Super bowl {{ season.numberOfSuperBowl }}, {{ season.year }}</div>

        <div class="selector-container">
          <md-field class="md-layout-item selector md-size-40">
            <md-select v-model="selectedWeek">
              <md-option
                v-for="week of weeks" :key="week.number"
                :value="week.number">
                {{ week.label }}
              </md-option>
            </md-select>
          </md-field>

          <md-field class="md-layout-item selector md-size-40">
            <md-select v-model="selectedPlayer">
              <md-option
                v-for="player of players" :key="player.id"
                :value="player.id">
                {{ player.name }}
              </md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <div v-for="game in gameList" :key="game._id" class="game-container">
            <div class="team-container">
              <img :src="require(`../assets/team-logos/${game.awayTeamAlias}.gif`)" class="logo">

              <md-button
                class="md-raised material-button"
                :class="{ 'md-primary': isThisTeamSelected(game, teamBet.AWAY) }"
                :disabled="!game.isOpen"
                @click="onBet(game, teamBet.AWAY)">
                {{ getTeamLabel(game.awayTeamAlias) }}
              </md-button>
            </div>

            <i class="fa fa-at at-icon" aria-hidden="true"></i>

            <div class="team-container">
              <md-button
                class="md-raised material-button"
                :class="{ 'md-primary': isThisTeamSelected(game, teamBet.HOME) }"
                :disabled="!game.isOpen"
                @click="onBet(game, teamBet.HOME)">
                {{ getTeamLabel(game.homeTeamAlias) }}
              </md-button>

              <img :src="require(`../assets/team-logos/${game.homeTeamAlias}.gif`)" class="logo">
            </div>
          </div>
          <md-button
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
// import * as getTeamLabel from '../constants/team-names'
import teamNamesMixin from '../mixins/teamNamesMixin'
import teamBet from '../constants/team-bet'
import SpinnerService from '../services/SpinnerService'
import { ApiRoutes } from '../utils/ApiRoutes'
import * as axios from 'axios'

export default {
  name: 'Game',
  mixins: [teamNamesMixin],
  props: {
    season: Object,
    players: Array,
    leagueId: String
  },
  data () {
    return {
      weeks: [],
      selectedWeek: null,
      selectedPlayer: null,
      user: null,
      gameList: [],
      teamBet: teamBet
    }
  },
  methods: {
    createWeeksList () {
      this.season.weeks.forEach(week => {
        this.weeks.push({ number: week.number, label: `week ${week.number}` })
      })
      this.selectedWeek = this.weeks[this.weeks.length - 1].number
    },
    setDefaultUPlayer () {
      this.user = JSON.parse(localStorage.getItem(localStorageKeys.NFL_TIPPER_USER))
      this.selectedPlayer = this.user.userId
    },
    createGameList () {
      const currentWeek = this.season.weeks.find(week => week.number === this.selectedWeek)
      this.gameList = currentWeek.games
      console.log(this.gameList)
    },
    onBet (game, bet) {
      const userBet = game.bets.find(bet => bet.id === this.user.userId)
      userBet.bet = bet
    },
    isThisTeamSelected (game, bet) {
      const userBet = game.bets.find(bet => bet.id === this.user.userId)
      return userBet.bet === bet
    },
    onSaveBets () {
      SpinnerService.setSpinner(true)
      const week = this.season.weeks.find(week => week.number === this.selectedWeek)
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.SAVE_BETS.path}`
      axios.post(path, { leagueId: this.leagueId, week: week }, { headers: this.headers })
        .then(resp => {
          console.log(resp)
          // SpinnerService.setSpinner(false)
        })
    }
  },
  watch: {
    selectedWeek: function (val) {
      this.createGameList()
    },
    selectedPlayer: function (val) {}
  },
  mounted () {
    this.token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
    this.headers = {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + this.token
    }
    console.log(this.season)
    this.createWeeksList()
    this.setDefaultUPlayer()
    this.createGameList()
  }
}
</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';
.card-padding {
  padding: 20px;
}
.selector-container {
  margin: auto;
  display: flex;
  justify-content: center;
}
.selector {
  width: 180px;
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
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.team-container {
  width: 170px;
}
</style>
