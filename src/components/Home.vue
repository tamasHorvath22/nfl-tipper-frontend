<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-25 md-small-size-90 card-margin">
      <Profile/>
    </div>

    <div class="md-layout-item md-size-60 md-small-size-90 card-margin">
      <Leagues/>
    </div>
  </div>
</template>

<script>
import Profile from './Profile'
import Leagues from './Leagues'

export default {
  name: 'Home',
  components: {
    Profile,
    Leagues
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';

.profile-header {
  font-size: 30pt;
}

.profile-container {
  width: 600px;
  margin: auto;
}
.user-data-container {
  margin-top: 50px;
}

.card-margin {
  margin-left: 5%;
  margin-top: 30px;
}

.create-league-button {
  margin: 20px;
}
.leagues-header {
  font-size: 26px;
}
.button {
  background-color: rgb(65, 134, 83) !important;
  text-transform: none
}

</style>
