<template>
  <div class="rules-container">
    <md-card class="md-layout-item md-size-50 md-medium-size-70 md-small-size-90 container rules-card">
      <h2>Rules</h2>

      <p>Welcome to NFL Tipper!</p>
      <p>
        To start playing, create a league. Tell your friends to register, ask them to send you their email addresses,
        and invite each player one by one. Now you are ready to play!
      </p>
      <p>
        First of all, guess the final winner of the season.
        You can modify  your guess until the kickoff of the season opening game.
        If your  guess for the champion is right, you are going to be rewarded by 30 points.
      </p>
      <p>
        Each week you can guess each game.
        First you need to estimate who is going to win, then guess the points difference.
      </p>
      <div class="options">
        <p class="opions-header">You have four options:</p>
        <ul>
          <li>0 -3 (draw included on each side)</li>
          <li>4 - 7</li>
          <li>8 - 14</li>
          <li>15+</li>
        </ul>
      </div>
      <p>
        If you  correctly guess the outcome of the game, you get 1 point,
        but if your guess for the difference is also correct,
        you get 3 more points. This means that you can earn maximum 4 points per game.
      </p>
      <p class="good-luck">Good luck, and have fun!</p>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'Spinner'
}
</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';

.rules-container {
  color: black;
  margin-top: 20px;
  text-align: left;
}
h2 {
  text-align: center;
  margin-bottom: 24px;
}
.rules-card {
  padding: 12px;
}
.options {
  display: flex;
}
.good-luck {
  text-align: center;
}
.opions-header {
  min-width: 200px;
}
</style>
