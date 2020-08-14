<template>
  <div class="md-layout">
    <md-card class="standings-container">
      <div class="standings-header">Standings</div>
      <div v-if="colors.length">
        <md-card
          v-for="(player, index) in standings" :key="player.name"
          class="standing-card"
          :class="{ 'own-row': player.id === user.userId }">
          <div class="avatar-container">
            <img :src="getPlayerAvatar(player.id)" class="avatar">
          </div>
          <div class="name-points">
            <div class="player-data-container">
              <div class="font-22">{{ index + 1 }}. </div>
              <div class="player-name">{{ player.name }} - </div>
              <div class="font-22">{{ player.score }}</div>
            </div>

            <div
              class="bar"
              :style="{
                width: getBarWidth(player),
                backgroundColor: colors[index]
              }"
            >

            </div>
          </div>
        </md-card>
      </div>
    </md-card>
  </div>
</template>

<script>
import localStorageKeys from '../constants/localStorageKeys'
import utilsMixin from '../mixins/utils'

export default {
  name: 'Standings',
  mixins: [utilsMixin],
  props: {
    standings: Array,
    players: Array
  },
  data () {
    return {
      user: null,
      colors: []
    }
  },
  methods: {
    sortStandings () {
      this.standings.sort((a, b) => {
        return a.score > b.score ? -1 : 1
      })
    },
    getBarWidth (player) {
      const maxValue = this.standings[0].score
      if (!player.score) {
        return '3%'
      }
      const width = player.score / maxValue * 100
      return `${width}%`
    },
    createColors () {
      for (let i = 0; i < this.standings.length; i++) {
        const maxValue = 255
        const r = Math.floor(Math.random() * maxValue)
        const g = Math.floor(Math.random() * maxValue)
        const b = Math.floor(Math.random() * maxValue)
        this.colors.push(
          `rgba(${r}, ${g}, ${b}, 0.6)`
        )
      }
    },
    getPlayerAvatar (playerId) {
      const player = this.players.find(p => p.id === playerId)
      return this.notNullOrUndefinded(player.avatar) ? player.avatar : require('../assets/images/nfl-logo.png')
    }
  },
  mounted () {
    this.user = JSON.parse(localStorage.getItem(localStorageKeys.NFL_TIPPER_USER))
    this.sortStandings()
    this.createColors()
  }
}
</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';
.standings-container {
  width: 100%;
  padding: 20px;
  background-color: $bg-grey;
}
.standing-card {
  padding: 7px;
  margin-bottom: 5px;
  background-color: rgb(233, 233, 233);
  display: flex;
  align-items: center;
}
.name-points {
  text-align: left;
  margin-bottom: 5px;
  font-size: 16px;
  width: 100%;
}
.font-22 {
  font-size: 22px;
}
.bar {
  height: 10px;
  width: 200px;
  border-radius: 8px;
  text-align: left;
  font-weight: bold;
}
.standings-header {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
}
.own-row {
  background-color: rgb(182, 223, 182);
}
.avatar-container {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  display: flex;
  align-items: center;
}
.avatar {
  max-width: 100%;
  max-height: 100%;
}
.player-data-container {
  display: flex;
  margin-bottom: 3px;
}
.player-name {
  margin: 0px 5px;
}
</style>
