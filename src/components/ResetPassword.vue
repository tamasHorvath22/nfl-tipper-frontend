<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-30 md-small-size-90 card-bg container-margin container-padding">
      <md-field>
        <label class="label">Password</label>
        <div class="login-input">
          <md-input
            name="password"
            id="password"
            type="password"
            class="input-field"
            v-validate="'required|min:8'"
            v-model="password"/>
        </div>
      </md-field>
      <div class="error-message">{{ errors.first('password') }}</div>
      <md-field>
        <label class="label">Password again</label>
        <div class="login-input">
          <md-input
            name="confirm_password"
            id="confirm_password"
            class="input-field"
            v-validate="'required|min:8'"
            type="password"
            v-model="confirm_password"/>
        </div>
      </md-field>
      <div class="error-message">{{ errors.first('confirm_password') }}</div>
      <div
        class="error-message"
        v-if="showNotEqualPasses">
          The passwords must match!
      </div>
      <div
        class="error-message"
        v-if="showError">
          Reseting password failed. Please try again!
      </div>
      <md-button
        class="md-raised md-primary submit-button material-button"
        @click="onResetPassword">
        Reset password
      </md-button>
    </div>
  </div>
</template>

<script>
import { Routes } from '../utils/Routes'
import { ApiRoutes } from '../utils/ApiRoutes'
import validationMixin from '../mixins/validationMixin'
import * as axios from 'axios'
import ApiErrorMessages from '../constants/api-response-messages'
import SpinnerService from '../services/SpinnerService'

export default {
  name: 'ResetPassword',
  mixins: [validationMixin],
  data () {
    return {
      showNotEqualPasses: false,
      showError: false,
      hash: null,
      password: null,
      confirm_password: null
    }
  },
  methods: {
    onResetPassword () {
      SpinnerService.setSpinner(true)
      this.showNotEqualPasses = false
      this.$validator.validateAll().then(valid => {
        if (valid) {
          if (this.passwordsAreEqual()) {
            const path = process.env.VUE_APP_BASE_URL + ApiRoutes.NEW_PASSWORD.path
            axios.post(path, { password: this.password, hash: this.hash })
              .then(resp => {
                SpinnerService.setSpinner(false)
                if (resp.data === ApiErrorMessages.USER.RESET_PASSWORD_SUCCESS) {
                  this.onGoToLoginPage()
                } else if (
                  resp.data === ApiErrorMessages.USER.RESET_PASSWORD_FAIL ||
                  resp.data === ApiErrorMessages.COMMON.ERROR ||
                  resp.data === ApiErrorMessages.FORGET_PASSWORD.NO_REQUEST_FOUND) {
                  this.showError = true
                }
              })
          } else {
            this.showNotEqualPasses = true
            SpinnerService.setSpinner(false)
          }
        }
      })
    },
    checkPasswordToken () {
      const path = process.env.VUE_APP_BASE_URL + ApiRoutes.CHECK_PASS_HASH.path
      axios.post(path, { hash: this.hash })
        .then(resp => {
          SpinnerService.setSpinner(false)
          if (resp.data === ApiErrorMessages.USER.NO_HASH_FOUND) {
            this.onGoToLoginPage()
          }
        })
    },
    onGoToLoginPage () {
      this.$router.push(Routes.LOGIN.path)
    },
    passwordsAreEqual () {
      return this.password === this.confirm_password
    }
  },
  mounted () {
    this.hash = this.$route.params.hash
    SpinnerService.setSpinner(true)
    this.checkPasswordToken()
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
.container-padding {
  padding: 30px;
}
.md-field.md-theme-default.md-focused label {
  color: rgb(113, 120, 128) !important;
  font-size: 14px;
  font-weight: bold;
}
</style>
