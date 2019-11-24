<template>
  <div>
    <div class="page"><img class="bg-image" src="../assets/images/nfl-helmet.jpg"></div>
    <div class="login-form-container">
      <md-field>
        <label class="label">Username</label>
        <div class="login-input">
          <md-input
            name="username"
            id="username"
            v-validate="'required|min:6'"
            v-model="username"/>
        </div>
      </md-field>
      <div
        class="validate-error"
        v-if="showUsernameTaken">
          This username is taken
      </div>
      <div class="validate-error">{{ errors.first('username') }}</div>
      <md-field>
        <label class="label">Email</label>
        <div class="login-input">
          <md-input
            name="email"
            id="email"
            v-validate="{ required: true, validEmail: true }"
            v-model="email"/>
        </div>
      </md-field>
      <div
        class="validate-error"
        v-if="showEmailTaken">
          This email is taken
      </div>
      <div class="validate-error">{{ errors.first('email') }}</div>
      <md-field>
        <label class="label">Avatar URL</label>
        <div class="login-input">
          <md-input
            name="avatarUrl"
            id="avatarUrl"
            v-model="avatarUrl"/>
        </div>
      </md-field>
      <md-field>
        <label class="label">Password</label>
        <div class="login-input">
          <md-input
            name="password"
            id="password"
            type="password"
            v-validate="'required|min:8'"
            v-model="password"/>
        </div>
      </md-field>
      <div class="validate-error">{{ errors.first('password') }}</div>
      <md-field>
        <label class="label">Password again</label>
        <div class="login-input">
          <md-input
            name="confirm_password"
            id="confirm_password"
            v-validate="'required|min:8'"
            type="password"
            v-model="confirm_password"/>
        </div>
      </md-field>
      <div class="validate-error">{{ errors.first('confirm_password') }}</div>
      <div
        class="validate-error"
        v-if="showNotEqualPasses">
          The passwords must match!
      </div>
      <div>
        <md-button
          class="md-raised md-primary login-button"
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
  name: 'Login',
  mixins: [validationMixin],
  data () {
    return {
      username: null,
      email: null,
      avatarUrl: null,
      password: null,
      confirm_password: null,
      showNotEqualPasses: false,
      showUsernameTaken: false,
      showEmailTaken: false
    }
  },
  methods: {
    onRegister () {
      this.hideAllMessages()
      this.$validator.validateAll().then(valid => {
        if (valid) {
          const checkUrl = process.env.VUE_APP_BASE_URL + ApiRoutes.CHECK_BEFORE_REGISTER.path
          axios.post(checkUrl, { username: this.username, email: this.email })
            .then(response => {
              if (response.data.occupied.length === 0) {
                if (this.passwordsAreEqual()) {
                  const regPath = process.env.VUE_APP_BASE_URL + ApiRoutes.REGISTER.path
                  axios.post(regPath, this.createUserToRegister())
                    .then(registerResp => {
                      if (registerResp.data === responseMessages.USER.SUCCESSFUL_REGISTRATION) {
                        this.$router.push(Routes.LOGIN.path)
                      }
                    })
                } else {
                  this.showNotEqualPasses = true
                }
              } else {
                this.showTakenMessages(response.data.occupied)
              }
            })
        }
      })
    },
    createUserToRegister () {
      return {
        username: this.username,
        email: this.email,
        avatarUrl: this.avatarUrl,
        password: this.password
      }
    },
    showTakenMessages (responseList) {
      responseList.forEach(elem => {
        if (elem === responseMessages.USER.USERNAME_TAKEN) {
          this.showUsernameTaken = true
        }
        if (elem === responseMessages.USER.EMAIL_TAKEN) {
          this.showEmailTaken = true
        }
      })
    },
    hideAllMessages () {
      this.showNotEqualPasses = false
      this.showUsernameTaken = false
      this.showEmailTaken = false
    },
    passwordsAreEqual () {
      return this.password === this.confirm_password
    }
  }
}
</script>

<style scoped>
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
  height: 100%;
}
.login-form-container {
  padding: 15px;
  position: absolute;
  left: 700px;
  top: 50px;
  background-color: grey;
  border-radius: 10px;
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
.login-button {
  background-color: rgb(77, 142, 216);
}
.validate-error {
  color: red;
}
</style>
