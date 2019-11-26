<template>
  <div>
    <div class="page"><img class="bg-image" src="../assets/images/ball.jpg"></div>
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
      <div>
        <md-button
          class="md-raised md-primary submit-button"
          @click="onLogin">
          Login
        </md-button>
      </div>
      <div>
        <md-button
          class="md-dense md-primary go-register-button"
          @click="goRegister">
            Not registered yet?
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ApiRoutes } from '../utils/ApiRoutes'
import { Routes } from '../utils/Routes'
import * as axios from 'axios'
import responseMessages from '../constants/api-response-messages'
import localStorageKeys from '../constants/localStorageKeys'

export default {
  name: 'Login',
  data () {
    return {
      username: null,
      password: null,
      showWrongCred: false
    }
  },
  methods: {
    onLogin () {
      this.showWrongCred = false
      this.$validator.validateAll().then(valid => {
        if (valid) {
          const loginPath = process.env.VUE_APP_BASE_URL + ApiRoutes.LOGIN.path
          axios.post(loginPath, { username: this.username, password: this.password })
            .then(loginResp => {
              if (loginResp.data.token) {
                this.saveUserToLocalStorage(loginResp.data.token)
                localStorage.setItem(localStorageKeys.NFL_TIPPER_TOKEN, loginResp.data.token)
                this.$router.push(Routes.PROFILE.path)
              } else if (loginResp.data === responseMessages.USER.WRONG_USERNAME_OR_PASSWORD) {
                this.showWrongCred = true
              }
            })
        }
      })
    },
    async saveUserToLocalStorage (token) {
      const headers = {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + token
      }
      const userResponse = await axios.post(process.env.VUE_APP_BASE_URL + ApiRoutes.GET_USER.path, {}, { headers: headers })
      const userToSave = {
        username: userResponse.data.username,
        userId: userResponse.data._id,
        email: userResponse.data.email,
        leagues: userResponse.data.leagues
      }
      localStorage.setItem(localStorageKeys.NFL_TIPPER_USER, JSON.stringify(userToSave))
    },
    goRegister () {
      this.$router.push(Routes.REGISTER.path)
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
.login-form-container {
  position: absolute;
  /* left: 30px;
  bottom: 30px; */
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
</style>
