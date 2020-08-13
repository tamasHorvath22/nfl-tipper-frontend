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
          <div v-if="showFailedResetPassMessage" class="error-message">There was an error, please try again!</div>
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
import CryptoJS from 'crypto-js'

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
      forgotEmail: null,
      headers: null
    }
  },
  methods: {
    async onLogin () {
      this.showWrongCred = false
      this.showEmailNotConfirmed = false
      this.$validator.validateAll().then(valid => {
        if (valid) {
          const loginPath = process.env.VUE_APP_BASE_URL + ApiRoutes.LOGIN.path
          SpinnerService.setSpinner(true)
          axios.post(loginPath, { username: this.username, password: this.ncryptPassword() })
            .then(async (loginResp) => {
              if (loginResp.data.token) {
                this.token = loginResp.data.token
                this.headers = {
                  'Content-Type': 'application/json',
                  'authorization': 'Bearer ' + this.token
                }
                await this.saveUserToLocalStorage(loginResp.data.token)
                localStorage.setItem(localStorageKeys.NFL_TIPPER_TOKEN, loginResp.data.token)
                this.$router.push(Routes.LEAGUES.path)
              } else if (loginResp.data === ApiErrorMessages.USER.EMAIL_NOT_CONFIRMED) {
                this.showEmailNotConfirmed = true
              } else if (loginResp.data === ApiErrorMessages.USER.WRONG_USERNAME_OR_PASSWORD) {
                this.showWrongCred = true
              }
              SpinnerService.setSpinner(false)
            })
        }
      })
    },
    async saveUserToLocalStorage (token) {
      const userResponse = await axios.post(
        process.env.VUE_APP_BASE_URL + ApiRoutes.GET_USER.path,
        {},
        { headers: this.headers }
      )
      localStorage.setItem(
        localStorageKeys.NFL_TIPPER_USER,
        JSON.stringify(this.createUserToSave(userResponse.data))
      )
    },
    goRegister () {
      this.$router.push(Routes.REGISTER.path)
    },
    ncryptPassword () {
      return CryptoJS.AES.encrypt(
        this.password,
        process.env.VUE_APP_PASSWORD_SECRET_KEY
      ).toString()
    },
    onForgotPassword () {
      SpinnerService.setSpinner(true)
      this.showResetPassMessage = false
      this.noUserFound = false
      const path = `${process.env.VUE_APP_BASE_URL}${ApiRoutes.RESET_PASSWORD.path}`
      axios.post(path, { email: this.forgotEmail })
        .then(resp => {
          if (resp.data === ApiErrorMessages.USER.NOT_FOUND) {
            this.noUserFound = true
          } else if (resp.data === ApiErrorMessages.USER.RESET_PASSWORD_EMAIL_FAIL) {
            this.showFailedResetPassMessage = true
          } else if (resp.data === ApiErrorMessages.USER.RESET_PASSWORD_EMAIL_SENT) {
            this.hideModal()
          }
          SpinnerService.setSpinner(false)
        })
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
</style>
