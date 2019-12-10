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
}
@keyframes rotateY {
  0% { transform: rotateY( 18deg); }
  5% { transform: rotateY( 36deg); }
  10% { transform: rotateY( 54deg); }
  15% { transform: rotateY( 72deg); }
  20% { transform: rotateY( 90deg); }
  25% { transform: rotateY( 108deg); }
  30% { transform: rotateY( 126deg); }
  35% { transform: rotateY( 144deg); }
  40% { transform: rotateY( 162deg); }
  45% { transform: rotateY( 180deg); }
  50% { transform: rotateY( 198deg); }
  55% { transform: rotateY( 216deg); }
  60% { transform: rotateY( 234deg); }
  65% { transform: rotateY( 252deg); }
  70% { transform: rotateY( 270deg); }
  75% { transform: rotateY( 288deg); }
  80% { transform: rotateY( 306deg); }
  85% { transform: rotateY( 324deg); }
  90% { transform: rotateY( 342deg); }
  95% { transform: rotateY( 350deg); }
  100% { transform: rotateY( 360deg); }
}
@-webkit-keyframes rotateY {
  0% { transform: rotateY( 18deg); }
  5% { transform: rotateY( 36deg); }
  10% { transform: rotateY( 54deg); }
  15% { transform: rotateY( 72deg); }
  20% { transform: rotateY( 90deg); }
  25% { transform: rotateY( 108deg); }
  30% { transform: rotateY( 126deg); }
  35% { transform: rotateY( 144deg); }
  40% { transform: rotateY( 162deg); }
  45% { transform: rotateY( 180deg); }
  50% { transform: rotateY( 198deg); }
  55% { transform: rotateY( 216deg); }
  60% { transform: rotateY( 234deg); }
  65% { transform: rotateY( 252deg); }
  70% { transform: rotateY( 270deg); }
  75% { transform: rotateY( 288deg); }
  80% { transform: rotateY( 306deg); }
  85% { transform: rotateY( 324deg); }
  90% { transform: rotateY( 342deg); }
  95% { transform: rotateY( 350deg); }
  100% { transform: rotateY( 360deg); }
}
</style>
