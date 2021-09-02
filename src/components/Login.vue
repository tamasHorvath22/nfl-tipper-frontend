<template>
  <div>
    <div class="login-form-container input-box">
      <md-field>
        <label class="label">Username</label>
        <div class="login-input">
          <md-input
            class="input-field"
            name="username"
            id="username"
            v-validate="'required'"
            @keyup.enter="onLogin"
            v-model="username"/>
        </div>
      </md-field>
      <div class="error-message">{{ errors.first('username') }}</div>
      <md-field>
        <label class="label">Password</label>
        <div class="login-input">
          <md-input
            name="password"
            id="password"
            class="input-field"
            v-validate="'required'"
            type="password"
            @keyup.enter="onLogin"
            v-model="password"/>
        </div>
      </md-field>
      <div class="error-message">{{ errors.first('password') }}</div>
      <div v-if="showWrongCred" class="error-message">Wrong username or password!</div>
      <div v-if="showEmailNotConfirmed" class="error-message">Your email is not confirmed yet!</div>
      <div v-if="showUnexpectedError" class="error-message">Unexpected error occured</div>
      <div>
        <md-button
          class="md-raised md-primary submit-button material-button"
          @click="onLogin">
          Login
        </md-button>
      </div>
      <div>
        <md-button
          class="md-dense go-register-button material-button not-registered"
          @click="goRegister">
            Not registered yet?
        </md-button>
      </div>
      <div>
        <md-button
          class="md-dense go-register-button material-button not-registered"
          @click="showModal">
            Forgot your password?
        </md-button>
      </div>

      <modal name="modal" width="400" height="auto">
        <div class="modal-container">
          <div class="invite-modal-header">
            Type your email and click OK.
            We send you an email, just click on the link in it, and enter a new password.
          </div>
          <md-field class="email-field">
            <md-input
              name="email"
              placeholder="email"
              autofocus
              v-validate="{ required: true, validEmail: true }"
              v-model="forgotEmail"/>
          </md-field>
          <md-button class="md-primary md-raised material-button" @click="onForgotPassword">OK</md-button>
          <div v-if="noUserFound" class="error-message">No user found by this email</div>
          <div
            v-if="showFailedResetPassMessage"
            class="error-message">
            There was an error, please try again!
          </div>
        </div>
      </modal>

    </div>
  </div>
</template>

<script>
import { ApiRoutes } from '../utils/ApiRoutes'
import { Routes } from '../utils/Routes'
import * as axios from 'axios'
import localStorageKeys from '../constants/localStorageKeys'
import SpinnerService from '../services/SpinnerService'
import ApiErrorMessages from '../constants/api-response-messages'
import utilsMixin from '../mixins/utils'

export default {
  name: 'Login',
  mixins: [utilsMixin],
  data () {
    return {
      token: null,
      username: null,
      password: null,
      showWrongCred: false,
      showEmailNotConfirmed: false,
      noUserFound: false,
      showFailedResetPassMessage: false,
      showUnexpectedError: false,
      forgotEmail: null
    }
  },
  methods: {
    async onLogin () {
      this.hideErrorMessages()
      this.$validator.validateAll().then(async (valid) => {
        if (valid) {
          SpinnerService.setSpinner(true)
          const loginPath = process.env.VUE_APP_BASE_URL + ApiRoutes.LOGIN.path
          let loginResp
          try {
            loginResp = await axios.post(
              loginPath,
              { username: this.username, password: this.getNcryptedPassword(this.password) }
            )
          } catch (err) {
            this.showUnexpectedError = true
            SpinnerService.setSpinner(false)
            return
          }
          if (loginResp.data.token) {
            try {
              this.handleSuccessfulLogin(loginResp.data.token)
            } catch (err) {
              this.showUnexpectedError = true
              SpinnerService.setSpinner(false)
              return
            }
          } else if (loginResp.data === ApiErrorMessages.USER.EMAIL_NOT_CONFIRMED) {
            this.showEmailNotConfirmed = true
          } else if (loginResp.data === ApiErrorMessages.USER.WRONG_USERNAME_OR_PASSWORD) {
            this.showWrongCred = true
          } else if (loginResp.data === ApiErrorMessages.USER.ERROR) {
            this.showUnexpectedError = true
          }
          SpinnerService.setSpinner(false)
        }
      })
    },
    hideErrorMessages () {
      this.showWrongCred = false
      this.showEmailNotConfirmed = false
      this.showUnexpectedError = false
    },
    handleSuccessfulLogin (token) {
      this.token = token
      localStorage.setItem(localStorageKeys.NFL_TIPPER_TOKEN, this.token)
      const routeToGo = localStorage.getItem(localStorageKeys.ROUTE_TO_GO)
      localStorage.removeItem(localStorageKeys.ROUTE_TO_GO)
      this.$router.push(this.notNullOrUndefinded(routeToGo) ? routeToGo : Routes.LEAGUES.path)
    },
    goRegister () {
      this.$router.push(Routes.REGISTER.path)
    },
    async onForgotPassword () {
      SpinnerService.setSpinner(true)
      this.hideErrorMessages()
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.RESET_PASSWORD.path}`
      try {
        const resp = await axios.post(path, { email: this.forgotEmail })
        if (resp.data === ApiErrorMessages.USER.NOT_FOUND) {
          this.noUserFound = true
        } else if (resp.data === ApiErrorMessages.USER.RESET_PASSWORD_EMAIL_FAIL) {
          this.showFailedResetPassMessage = true
        } else if (resp.data === ApiErrorMessages.USER.RESET_PASSWORD_EMAIL_SENT) {
          this.hideModal()
        } else if (resp.data === ApiErrorMessages.DATABASE.ERROR) {
          this.showUnexpectedError = true
        }
      } catch (err) {
        this.showUnexpectedError = true
      }
      SpinnerService.setSpinner(false)
    },
    showModal () {
      this.$modal.show('modal')
    },
    hideModal () {
      this.$modal.hide('modal')
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';
.login-form-container {
  position: absolute;
  top: 50px;
  right: 50px;
}
.login-header {
  font-size: 24pt;
  text-align: center;
  margin: 15px 0px;
}
.login-input {
  background-color: white;
}
.go-register-button {
  font-size: 8pt;
}
.label {
  padding-left: 10px;
}
.not-registered {
  color: rgb(29, 209, 185) !important;
  font-size: 14px;
}
@media(max-width: 1024px){
  .login-form-container {
    width: 236px;
    position: relative;
    margin: auto;
    top: 0px;
    right: 0px;
  }
}
</style>
