<template>
  <div v-if="league" class="md-layout font-color">
    <div class="md-layout-item md-size-100">
      <md-card class="md-layout-item md-size-40 md-small-size-90 header-container">
        <div class="name-and-logo">
          <div v-if="!isOwner" class="not-owner">
            <div class="avatar-container">
              <img class="avatar" :src="getLeagueAvatar(league.leagueAvatarUrl)">
            </div>
            <div class="header">{{ league.name }}</div>
          </div>
          <md-list v-if="isOwner" class="outer-expand">
            <md-list-item md-expand class="accordion-elem">
              <div class="avatar-container">
                <img class="avatar" :src="getLeagueAvatar(league.leagueAvatarUrl)">
              </div>
              <div class="header">{{ league.name }}</div>
              <md-list slot="md-expand">
                <div class="league-options">
                  <md-button
                    class="md-primary md-raised material-button"
                    @click="showModal">
                    Invite player
                  </md-button>

                  <div>
                    <md-field>
                      <label for="first-name">League name</label>
                      <md-input
                        name="leagueName"
                        type="text"
                        ref="avatarUrl"
                        class="input-field avatar-input"
                        :class="{ 'url-editable': !isUrlFieldDisabled }"
                        v-model="league.name"
                        :disabled="isUrlFieldDisabled"/>
                    </md-field>
                    <md-field md-clearable>
                      <label for="first-name">League avatar URL</label>
                      <md-input
                        name="avatarUrl"
                        type="text"
                        ref="avatarUrl"
                        class="input-field avatar-input"
                        :class="{ 'url-editable': !isUrlFieldDisabled }"
                        v-model="league.leagueAvatarUrl"
                        :disabled="isUrlFieldDisabled"/>
                    </md-field>
                    <md-button
                      class="md-primary md-raised material-button edit-button"
                      @click="editSaveUrl">
                      {{ isUrlFieldDisabled ? 'Edit' : 'Save' }}
                    </md-button>
                    <md-button
                      class="md-primary md-raised material-button"
                      @click="onCancelEditing">
                      Cancel
                    </md-button>
                  </div>

                </div>
              </md-list>
            </md-list-item>
          </md-list>
        </div>

        <md-field class="season-selector">
          <md-select v-model="selectedSeasonYear">
            <md-option
              v-for="season of league.seasons" :key="season.year"
              :value="season.year">
              Super Bowl {{ romanize(season.numberOfSuperBowl) }}, {{ season.year }}
            </md-option>
          </md-select>
        </md-field>

      </md-card>
    </div>
    <div class="md-layout md-layout-item md-size-100">

      <div v-if="selectedSeason" class="md-layout-item md-size-40 md-small-size-90 card-margin">
        <Standings
          :standings="standings"
          :players="league.players"
          :isSeasonOpen="selectedSeason.isOpen"
          :finalWinner="selectedSeason.finalWinner"
          :showFinalWinners="selectedSeason.weeks.length > 1"
          class="standings-component"/>
        <FinalWinner
          v-if="selectedSeason.finalWinner"
          :leagueId="leagueId"
          :winnerTeam="selectedSeason.finalWinner[user.id]"
          :showFinalWinners="showAllFinalWinners"
          :finalWinnerBets="selectedSeason.finalWinner"
          :players="league.players"/>
      </div>

      <div class="md-layout-item md-size-45 md-small-size-90 card-margin margin-right-5">
        <Game
          :season="selectedSeason"
          :players="league.players"
          :leagueId="league.id"
          :hasMoreLeagues="hasMoreLeagues"
          class="game"/>
      </div>
    </div>

    <div v-if="league" class="md-layout-item md-size-20">
      <modal name="modal" width="400" height="auto">
        <div class="modal-container">
          <div class="header">Type your friend's email</div>
          <md-field class="email-field">
            <md-input
              name="email"
              placeholder="here..."
              ref="userEmailInput"
              v-validate="{ required: true, validEmail: true }"
              v-model="invitedEmail"/>
          </md-field>
          <md-button class="md-primary md-raised material-button" @click="onInvite">Invite</md-button>
          <div v-if="showInvalidEmailError" class="error-message">This email is not valid</div>
          <div v-if="noUserFound" class="error-message">No user found by this email</div>
          <div v-if="noLeagueFound" class="error-message">No league found, please try again!</div>
          <div v-if="userAlreadyInLeague" class="error-message">This user is already in the league.</div>
          <div v-if="userAlreadyInvited" class="error-message">This user is already invited.</div>
          <div
            v-if="errorWhileInvitation"
            class="error-message">
            There was an error during invitation. Please try again!
          </div>
        </div>
      </modal>
    </div>

  </div>
</template>

<script>
import { ApiRoutes } from '../utils/ApiRoutes'
import * as axios from 'axios'
import localStorageKeys from '../constants/localStorageKeys'
import SpinnerService from '../services/SpinnerService'
import validationMixin from '../mixins/validationMixin'
import ApiErrorMessages from '../constants/api-response-messages'
import Standings from '../components/Standings'
import Game from '../components/Game'
import FinalWinner from '../components/FinalWinner'
import utilsMixin from '../mixins/utils'
import leagueMixin from '../mixins/leagueMixin'
import jwtDecode from 'jwt-decode'

export default {
  name: 'League',
  mixins: [validationMixin, utilsMixin, leagueMixin],
  components: { Standings, Game, FinalWinner },
  data () {
    return {
      user: null,
      hasMoreLeagues: false,
      token: null,
      leagueId: null,
      league: null,
      standings: null,
      invitedEmail: null,
      isModalOpen: null,
      showInvalidEmailError: false,
      noUserFound: false,
      noLeagueFound: false,
      userAlreadyInLeague: false,
      userAlreadyInvited: false,
      errorWhileInvitation: false,
      isOwner: null,
      isUrlFieldDisabled: true,
      selectedSeasonYear: null,
      selectedSeason: null,
      currentLeagueName: null,
      currentAvatarUrl: null,
      showAllFinalWinners: null
    }
  },
  methods: {
    async getLeague () {
      SpinnerService.setSpinner(true)
      this.leagueId = this.$route.params.leagueId
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.GET_LEAGUE.path}`
      try {
        const respone = await axios.post(path, { leagueId: this.leagueId }, { headers: this.getHeader(this.token) })
        this.league = respone.data
        this.setSelectedSeason()
        this.isOwner = this.league.creator === this.user.id
        this.showAllFinalWinners = this.selectedSeason.weeks.length > 1
          ? true
          : new Date().getTime() > new Date(this.selectedSeason.weeks[0].games.sort((a, b) => a.startTime > b.startTime ? 1 : -1)[0].startTime).getTime()
        SpinnerService.setSpinner(false)
      } catch {
        SpinnerService.setSpinner(false)
      }
    },
    onInvite () {
      this.hideAllErrorMessages()
      this.$validator.validateAll().then(valid => {
        if (valid) {
          SpinnerService.setSpinner(true)
          const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.LEAGUE_INVITATION.path}`
          axios.post(
            path,
            { leagueId: this.leagueId, invitedEmail: this.invitedEmail },
            { headers: this.getHeader(this.token) }
          )
            .then(resp => {
              if (resp.data === ApiErrorMessages.USER.NO_EMAIL_FOUND) {
                this.noUserFound = true
              } else if (resp.data === ApiErrorMessages.LEAGUE.LEAGUES_NOT_FOUND) {
                this.noLeagueFound = true
              } else if (resp.data === ApiErrorMessages.LEAGUE.USER_ALREADY_IN_LEAGUE) {
                this.userAlreadyInLeague = true
              } else if (resp.data === ApiErrorMessages.LEAGUE.USER_ALREADY_INVITED) {
                this.userAlreadyInvited = true
              } else if (resp.data === ApiErrorMessages.LEAGUE.INVITATION_SUCCESS) {
                this.hideModal()
              } else {
                this.errorWhileInvitation = true
              }
              SpinnerService.setSpinner(false)
            })
            .catch(() => {})
        } else {
          this.showInvalidEmailError = true
        }
      })
    },
    hideAllErrorMessages () {
      this.showInvalidEmailError = false
      this.noUserFound = false
      this.noLeagueFound = false
      this.userAlreadyInLeague = false
      this.userAlreadyInvited = false
      this.errorWhileInvitation = false
    },
    showModal () {
      setTimeout(() => {
        this.$nextTick(function () {
          this.$refs.userEmailInput.$el.focus()
        })
      })
      this.$modal.show('modal')
    },
    hideModal () {
      this.$modal.hide('modal')
    },
    editSaveUrl () {
      if (this.isUrlFieldDisabled) {
        this.setLeagueTempData()
        this.isUrlFieldDisabled = false
        return
      }
      SpinnerService.setSpinner(true)
      const path = process.env.VUE_APP_BASE_URL + ApiRoutes.CHANGE_LEAGUE_AVATAR.path
      axios.post(
        path,
        { leagueId: this.leagueId, avatarUrl: this.league.leagueAvatarUrl, leagueName: this.league.name },
        { headers: this.getHeader(this.token) }
      )
        .then(resp => {
          SpinnerService.setSpinner(false)
        })
        .catch(() => {})
      this.isUrlFieldDisabled = !this.isUrlFieldDisabled
    },
    onCancelEditing () {
      if (!this.isUrlFieldDisabled) {
        this.isUrlFieldDisabled = true
        this.league.name = this.currentLeagueName
        this.league.leagueAvatarUrl = this.currentAvatarUrl
      }
    },
    setSelectedSeason () {
      this.selectedSeason = this.league.seasons.find(season => season.isOpen)
      this.selectedSeasonYear = this.selectedSeason.year
      this.setAndSortStandings()
    },
    setAndSortStandings () {
      this.standings = this.selectedSeason.standings
      this.standings.sort((a, b) => {
        return a.score > b.score ? -1 : 1
      })
    },
    setLeagueTempData () {
      this.currentLeagueName = this.league.name
      this.currentAvatarUrl = this.league.leagueAvatarUrl
    }
  },
  watch: {
    selectedSeasonYear: function (val) {
      this.selectedSeason = this.league.seasons.find(season => season.year === val)
      this.setAndSortStandings()
    }
  },
  mounted () {
    this.token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
    this.user = jwtDecode(this.token)
    this.hasMoreLeagues = this.user.leagues.length > 1
    this.getLeague()
  }
}

</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';
.header-container {
  padding: 10px;
  margin: 30px auto;
}
.name-and-logo {
  display: flex;
  align-items: center;
}
.font-color {
  color: rgb(255, 255, 255);
}
.email-field {
  width: 80%;
  margin: auto;
}
.header {
  color: black;
  font-size: 20px;
  font-weight: 600;
  margin: auto;
}
.card-margin {
  margin-left: 5%;
  margin-top: 30px;
}
.margin-right-5 {
  margin-right: 5%;
}
.game {
  margin-bottom: 30px;
}
.edit-button {
  margin-right: 40px;
}
.outer-expand {
  width: 100%;
}
.url-editable {
  background-color: rgb(207, 207, 202) !important;
}
.avatar-input {
  margin: 0;
  padding-left: 5px;
}
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
}
.avatar {
  max-width: 80px;
  max-height: 80px;
}
.not-owner {
  display: flex;
  width: 100%;
}
::v-deep .accordion-elem .md-list-item-expand .md-list-item-content {
  padding: 0;
}
::v-deep .season-selector .md-select .md-input{
  font-size: 24px;
  text-align: center;
}
::v-deep .md-list-item-expand {
  border: 0;
}
.league-options {
  background-color: rgba(217, 218, 165, 0.8) !important;
  padding: 7px;
  width: 95%;
  margin: auto;
}
.standings-component {
  margin-bottom: 20px;
}
</style>
