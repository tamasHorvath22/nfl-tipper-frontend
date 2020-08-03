<template>
  <div>
    <div class="spinner-backdrop">
      <img src="../assets/images/nfl-logo-spinner.png" class="spinner" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Spinner'
}
</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';

.spinner-backdrop {
  position: absolute;
  background-color: rgba(220,220,220, 0.3);
  width: 100%;
  height: 100%;
  z-index: 9999;
}
.spinner {
  position: fixed;
  left: calc(50vw - 150px);
  top: calc(50vh - 95px);
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
