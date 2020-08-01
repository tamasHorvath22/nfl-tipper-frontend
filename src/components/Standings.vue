<template>
  <div class="md-layout">
    <md-card class="card-padding">
      <div class="standings-header">Standings</div>
      <div v-if="colors">
        <div v-for="(player, index) in standings" :key="player.name">
          <div
            class="bar"
            :style="{
              width: getBarWidth(player),
              backgroundColor: colors[index].bgColor,
              color: colors[index].color }"
            >
            {{ player.name }} - {{ player.score }}
          </div>
        </div>
      </div>
      <!-- <LineChart :standings="standings"/> -->
    </md-card>
  </div>
</template>

<script>
// import LineChart from '../charts/LineChart.vue'

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
      colors: []
    }
  },
  methods: {
    getBarWidth (player) {
      const maxWidth = 250
      const maxValue = this.standings[0].score
      const width = player.score / maxValue * maxWidth
      return `${width}px`
    },
    createColors () {
      for (let i = 0; i < this.standings.length; i++) {
        const maxValue = 255
        const r = Math.floor(Math.random() * maxValue)
        const g = Math.floor(Math.random() * maxValue)
        const b = Math.floor(Math.random() * maxValue)
        this.colors.push({
          bgColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
          color: `rgb(${r - 150 < 0 ? r + 150 : r - 150}, ${g - 150 < 0 ? g + 150 : g - 150}, ${b - 150 < 0 ? b + 150 : b - 150})`
        })
      }
    }
  },
  mounted () {
    this.createColors()
    console.log(this.standings)
  }
}
</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';
.card-padding {
  padding: 20px;
}
.bar {
  background-color: rgb(222, 222, 222);
  min-height: 25px;
  width: 200px;
  border-radius: 8px;
  text-align: left;
  padding-left: 10px;
  margin-bottom: 15px;
  font-weight: bold;
}
.standings-header {
  margin-bottom: 20px;
}
</style>
