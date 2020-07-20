<template>
  <div>
    <div class="page"><img class="bg-image" src="../assets/images/nfl-helmet.jpg"></div>
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
    </div>
  </div>
</template>

<script>
import { Routes } from '../utils/Routes'
import { ApiRoutes } from '../utils/ApiRoutes'
import validationMixin from '../mixins/validationMixin'
import * as axios from 'axios'
import responseMessages from '../constants/api-response-messages'

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
      showRegistrationFail: false
    }
  },
  methods: {
    onRegister () {
      this.hideAllMessages()
      this.$validator.validateAll().then(valid => {
        if (valid) {
          if (this.passwordsAreEqual()) {
            const regPath = process.env.VUE_APP_BASE_URL + ApiRoutes.REGISTER.path
            axios.post(regPath, this.createUserToRegister())
              .then(registerResp => {
                this.handleRegisterResponse(registerResp.data)
              })
          } else {
            this.showNotEqualPasses = true
          }
        }
      })
    },
    handleRegisterResponse (response) {
      if (response === responseMessages.USER.SUCCESSFUL_REGISTRATION) {
        this.$router.push(Routes.LOGIN.path)
      } else if (response === responseMessages.USER.USERNAME_TAKEN) {
        this.showUsernameTaken = true
      } else if (response === responseMessages.USER.EMAIL_TAKEN) {
        this.showEmailTaken = true
      } else if (response === responseMessages.USER.UNSUCCESSFUL_REGISTRATION) {
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
    },
    passwordsAreEqual () {
      return this.password === this.confirm_password
    },
    onLoginPage () {
      this.$router.push(Routes.LOGIN.path)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';

.page {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.5;
  width: 100%;
  height: 100%;
}
.bg-image {
  width: 100%;
}
.register-form-container {
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
.md-field.md-theme-default.md-focused label {
  color: white !important;
  font-size: 14px;
  font-weight: bold;
}
</style>
