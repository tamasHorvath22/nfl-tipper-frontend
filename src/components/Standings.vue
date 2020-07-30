<template>
  <div class="md-layout">
    <md-card class="card-padding">
      <div>
        <!-- <div v-for="player in standings" :key="player.id">
          <div>{{ player.name }} - {{ player.score }}</div>
        </div> -->
      </div>
      <LineChart :standings="standings"/>
    </md-card>
  </div>
</template>

<script>
import LineChart from '../charts/LineChart.vue'

export default {
  name: 'Standings',
  components: {
    LineChart
  },
  props: {
    standings: Array
  },
  data () {
    return {}
  },
  methods: {},
  mounted () {
    // console.log(this.standings)
  }
}
</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';
.card-padding {
  padding: 20px;
}
</style>
