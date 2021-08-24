<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-50 md-small-size-90 card-bg container-margin">
      <div v-if="isConfirmed" class="message-container">
        <div class="success-message margin-bottom-20">Your email was confirmed!</div>
        <md-button
          class="md-primary md-raised submit-button material-button"
          @click="onGoToLoginPage()">
          Go to Login page!
        </md-button>
      </div>
      <div v-if="isNotConfirmed" class="message-container">
        <div class="error-message margin-bottom-20">Your email was not confirmed!</div>
        <div class="error-message">Please try again!</div>
      </div>
      <div v-if="isUnexpectedError" class="message-container">
        <div class="error-message margin-bottom-20">Unexpected Error!</div>
        <div class="error-message">Please try again!</div>
      </div>
      <div v-if="noHashFound" class="message-container">
        <div class="margin-bottom-20">No registration found!</div>
        <md-button
          class="md-primary md-raised submit-button material-button"
          @click="onGoToRegisterPage()">
          Go to Register page!
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ApiRoutes } from '../utils/ApiRoutes'
import * as axios from 'axios'
import { Routes } from '../utils/Routes'
import ApiErrorMessages from '../constants/api-response-messages'
import SpinnerService from '../services/SpinnerService'

export default {
  name: 'ConfirmEmail',
  data () {
    return {
      isConfirmed: false,
      isNotConfirmed: false,
      noHashFound: false,
      isUnexpectedError: false
    }
  },
  methods: {
    async confirmEmail (hash) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_BASE_URL}${ApiRoutes.CONFIRM_EMAIL.path}/${hash}`)
        SpinnerService.setSpinner(false)
        if (response.data === ApiErrorMessages.USER.EMAIL_CONFIRMED) {
          this.isConfirmed = true
        } else if (response.data === ApiErrorMessages.USER.EMAIL_CONFIRM_FAIL) {
          this.isNotConfirmed = true
        } else if (response.data === ApiErrorMessages.USER.NO_EMAIL_HASH_FOUND) {
          this.noHashFound = true
        } else if (response.data === ApiErrorMessages.DATABASE.ERROR) {
          this.isUnexpectedError = true
        }
      } catch {
        SpinnerService.setSpinner(false)
      }
    },
    onGoToLoginPage () {
      this.$router.push(Routes.LOGIN.path)
    },
    onGoToRegisterPage () {
      this.$router.push(Routes.REGISTER.path)
    }
  },
  mounted () {
    SpinnerService.setSpinner(true)
    this.confirmEmail(this.$route.params.hash)
  }
}
</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';
.message-container {
  margin: 50px;
}
.margin-bottom-20 {
  margin-bottom: 20px;
}
</style>
