<template>
  <div>
    <div class="page"><img class="bg-image" src="../assets/images/ball.jpg"></div>
    <div class="login-form-container">
      <md-field>
        <label class="label">Username</label>
        <div class="login-input">
          <md-input
            name="username"
            id="username"
            v-model="username"/>
        </div>
      </md-field>
      <md-field>
        <label class="label">Password</label>
        <div class="login-input">
          <md-input
            name="password"
            id="password"
            type="password"
            v-model="password"/>
        </div>
      </md-field>
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
import HttpService from '../services/HttpService'
import { Routes } from '../utils/Routes'

export default {
  name: 'Login',
  props: {
    msg: String
  },
  data () {
    return {
      username: null,
      password: null
    }
  },
  methods: {
    onLogin () {
      console.log('nyomom a gombot!')
      console.log(HttpService.post('http://localhost:3000/login', { username: 'admin', password: 'jelszava' }))
      console.log('loginelnék!')
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
