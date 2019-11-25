<template>
  <div>
    <div class="page"><img class="bg-image" src="../assets/images/ball.jpg"></div>
    <div class="login-form-container">
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
      <div class="validate-error">{{ errors.first('username') }}</div>
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
      <div class="validate-error">{{ errors.first('password') }}</div>
      <div v-if="showWrongCred">Wrong username or password</div>
      <div>
        <md-button
          class="md-raised md-primary login-button"
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
                localStorage.setItem('token', loginResp.data.token)
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
      const user = await axios.post(process.env.VUE_APP_BASE_URL + ApiRoutes.GET_USER.path, {}, { headers: headers })
      localStorage.setItem('nflTipperUser', JSON.stringify(user))
    },
    goRegister () {
      this.$router.push(Routes.REGISTER.path)
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
  left: 800px;
  top: 200px;
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
}
.go-register-button {
  font-size: 8pt;
}
.login-button {
  background-color: rgb(77, 142, 216);
}
.label {
  padding-left: 10px;
}
</style>
