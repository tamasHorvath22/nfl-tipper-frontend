<template>
  <div>
    leagues
  </div>
</template>

<script>
// import { ApiRoutes } from '../utils/ApiRoutes'
// import * as axios from 'axios'
// import localStorageKeys from '../constants/localStorageKeys'

export default {
  name: 'Leagues',
  data () {
    return {}
  },
  methods: {},
  mounted () {}
}

</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';

.spinner-backdrop {
  position: relative;
  background-color: rgba(220,220,220, 0.3);
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}
.spinner {
  position: absolute;
  left: calc(50% - 150px);
  top: calc(50% - 95px);
  width: 300x;
  height: 167px;
  animation: rotateY 1.7s infinite;
  animation-timing-function: linear;
}
@keyframes rotateY {
  0% { transform: rotateY( 0deg); }
  100% { transform: rotateY( 360deg); }
}
@-webkit-keyframes rotateY {
  0% { transform: rotateY( 0deg); }
  100% { transform: rotateY( 360deg); }
}
</style>
