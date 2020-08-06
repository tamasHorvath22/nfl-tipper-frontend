<template>
  <div class="container">
    <div class="register-form-container input-box">
      <md-field>
        <label class="label">Username</label>
        <div class="login-input">
          <md-input
            name="username"
            id="username"
            class="input-field"
            v-validate="'required|min:6'"
            v-model="username"/>
        </div>
      </md-field>
      <div
        class="error-message"
        v-if="showUsernameTaken">
          This username is taken
      </div>
      <div class="error-message">{{ errors.first('username') }}</div>
      <md-field>
        <label class="label">Email</label>
        <div class="login-input">
          <md-input
            name="email"
            id="email"
            class="input-field"
            v-validate="{ required: true, validEmail: true }"
            v-model="email"/>
        </div>
      </md-field>
      <div
        class="error-message"
        v-if="showEmailTaken">
          This email is taken
      </div>
      <div
        class="error-message"
        v-if="showEmailNotValid">
          This email is not valid.
      </div>
      <div class="error-message">{{ errors.first('email') }}</div>
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
        v-if="showRegistrationFail">
          Registration failed
      </div>
      <div>
        <md-button
          class="md-raised submit-button material-button to-login"
          @click="onLoginPage">
          To Login page
        </md-button>
        <md-button
          class="md-raised md-primary submit-button material-button"
          @click="onRegister">
          Register
        </md-button>
      </div>

      <modal name="modal" width="400" height="auto" :clickToClose="false">
        <div class="modal-container">
          <div class="invite-modal-header margin-bottom-30">
            You registered succcessfully! An email was sent to your address.
            Please click on the link to confirm your email, and activate your account
          </div>
          <md-button class="md-primary md-raised create-league-button material-button" @click="onLoginPage">Ok</md-button>
        </div>
      </modal>

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
  name: 'Register',
  mixins: [validationMixin],
  data () {
    return {
      username: null,
      email: null,
      password: null,
      confirm_password: null,
      showNotEqualPasses: false,
      showUsernameTaken: false,
      showEmailTaken: false,
      showRegistrationFail: false,
      showEmailNotValid: false
    }
  },
  methods: {
    onRegister () {
      SpinnerService.setSpinner(true)
      this.hideAllMessages()
      this.$validator.validateAll().then(valid => {
        if (valid) {
          if (this.passwordsAreEqual()) {
            const regPath = process.env.VUE_APP_BASE_URL + ApiRoutes.REGISTER.path
            axios.post(regPath, this.createUserToRegister())
              .then(registerResp => {
                this.handleRegisterResponse(registerResp.data)
                SpinnerService.setSpinner(false)
              })
          } else {
            this.showNotEqualPasses = true
          }
        }
      })
    },
    handleRegisterResponse (response) {
      if (response === ApiErrorMessages.USER.SUCCESSFUL_REGISTRATION) {
        this.showModal()
      } else if (response === ApiErrorMessages.USER.USERNAME_TAKEN) {
        this.showUsernameTaken = true
      } else if (response === ApiErrorMessages.USER.EMAIL_TAKEN) {
        this.showEmailTaken = true
      } else if (response === ApiErrorMessages.EMAIL.NOT_VALID) {
        this.showEmailNotValid = true
      } else if (response === ApiErrorMessages.USER.UNSUCCESSFUL_REGISTRATION) {
        this.showRegistrationFail = true
      }
    },
    createUserToRegister () {
      return {
        username: this.username,
        email: this.email,
        password: this.password
      }
    },
    hideAllMessages () {
      this.showNotEqualPasses = false
      this.showUsernameTaken = false
      this.showEmailTaken = false
      this.showRegistrationFail = false
      this.showEmailNotValid = false
    },
    passwordsAreEqual () {
      return this.password === this.confirm_password
    },
    onLoginPage () {
      this.$router.push(Routes.LOGIN.path)
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

.register-form-container {
  width: 250px;
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
  width: 380px;
}
.go-register-button {
  font-size: 8pt;
}
.label {
  padding-left: 10px;
}
.to-login {
  background-color: rgb(94, 202, 245) !important;
}
</style>
