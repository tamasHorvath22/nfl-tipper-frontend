<template>
  <div class="md-layout">
    <md-card class="standings-container">
      <div class="standings-header">Standings</div>
      <div v-if="colors.length">
        <md-card
          v-for="(player, index) in standings" :key="player.name"
          class="standing-card"
          :class="{ 'own-row': player.id === user.userId }">
          <div class="name-points">
            <span class="font-22">{{ index + 1 }}. </span>
            <span>{{ player.name }} - </span>
            <span class="font-22">{{ player.score }}</span>
          </div>
          <div
            class="bar"
            :style="{
              width: getBarWidth(player),
              backgroundColor: colors[index]
              }"
            >
          </div>
        </md-card>
      </div>
      <!-- <LineChart :standings="standings"/> -->
    </md-card>
  </div>
</template>

<script>
// import LineChart from '../charts/LineChart.vue'
import localStorageKeys from '../constants/localStorageKeys'

export default {
  name: 'Standings',
  // components: {
  //   LineChart
  // },
  props: {
    standings: Array
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
        return a > b ? -1 : 1
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
}
.standing-card {
  padding: 7px;
  margin-bottom: 5px;
  background-color: rgb(233, 233, 233);
}
.name-points {
  text-align: left;
  margin-bottom: 5px;
  font-size: 16px;
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
</style>
