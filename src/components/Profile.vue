<template>
  <div class="md-layout">
    <form v-if="user" class="md-layout-item md-size-50 md-small-size-90 card-bg container-margin">
      <md-card class="card-bg">
        <md-card-header>
          <div class="md-title">
            <img v-if="user.avatarUrl" :src="user.avatarUrl" alt="avatar" class="avatar">
            {{ user.username }}
          </div>
          <hr>
        </md-card-header>

        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-small-size-100">
              <md-field class="not-editable-input">
                <label for="first-name">Username</label>
                <md-input
                  name="username"
                  type="text"
                  class="input-field input"
                  v-model="user.username"
                  disabled/>
                </md-field>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item md-small-size-100">
              <md-field class="not-editable-input">
                <label for="first-name">Email</label>
                <md-input
                  name="username"
                  type="text"
                  class="input-field input"
                  v-model="user.email"
                  disabled/>
              </md-field>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="first-name">Avatar URL</label>
                <md-input
                  name="username"
                  type="text"
                  class="input-field"
                  v-model="user.avatarUrl"
                  :disabled="isUserDataDisabled"/>
                </md-field>
                <md-button
                  type="button"
                  class="md-primary md-raised button material-button material-button"
                  @click="onEdit">
                    {{ isUserDataDisabled ? 'Edit URL' : 'Save URL' }}
                </md-button>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item md-small-size-100">
              <modal name="change-password" width="300" height="auto">
                <div class="modal-container">
                  <md-field>
                    <label class="label">Old password</label>
                    <div class="login-input">
                      <md-input
                        name="oldPassword"
                        type="password"
                        class="input-field"
                        v-validate="'required|min:8'"
                        v-model="oldPassword"/>
                    </div>
                  </md-field>
                  <div class="error-message">{{ errors.first('oldPassword') }}</div>
                  <div
                      v-if="wrongOldPassword"
                      class="error-message">
                      Your current password is not vaild!
                  </div>
                  <md-field>
                    <label class="label">New password</label>
                    <div class="login-input">
                      <md-input
                        name="newPassword"
                        type="password"
                        class="input-field"
                        v-validate="'required|min:8'"
                        v-model="newPassword"/>
                    </div>
                  </md-field>
                  <div class="error-message">{{ errors.first('newPassword') }}</div>
                  <md-field>
                    <label class="label">New password again</label>
                    <div class="login-input">
                      <md-input
                        name="confirm_new_password"
                        class="input-field"
                        v-validate="'required|min:8'"
                        type="password"
                        v-model="confirm_new_password"/>
                    </div>
                  </md-field>
                  <div class="error-message">{{ errors.first('confirm_new_password') }}</div>
                  <div
                      v-if="areNewPasswordsNotEqual"
                      class="error-message">
                      The entered passords are not equal!
                  </div>
                  <md-button
                    class="md-raised create-league-button material-button"
                    @click="hideModal('change-password')">
                    Cancel
                  </md-button>
                  <md-button
                    class="md-primary md-raised create-league-button material-button"
                    @click="changePassword">
                    Change
                  </md-button>
                </div>
              </modal>
              <md-button
                type="button"
                class="md-primary md-raised button material-button"
                @click="showModal('change-password')">Change password
              </md-button>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
import localStorageKeys from '../constants/localStorageKeys'
import * as axios from 'axios'
import { ApiRoutes } from '../utils/ApiRoutes'
import validationMixin from '../mixins/validationMixin'
import ApiErrorMessages from '../constants/api-response-messages'
import SpinnerService from '../services/SpinnerService'

export default {
  name: 'Profile',
  mixins: [validationMixin],
  data () {
    return {
      user: null,
      token: null,
      isUserDataDisabled: true,
      headers: null,
      oldPassword: null,
      confirm_new_password: null,
      newPassword: null,
      wrongOldPassword: null
    }
  },
  computed: {
    areNewPasswordsNotEqual () {
      if (this.newPassword && this.confirm_new_password) {
        if (this.newPassword.length < 8 || this.confirm_new_password.length < 8) {
          return null
        } else {
          return this.newPassword !== this.confirm_new_password
        }
      }
      return null
    }
  },
  methods: {
    onEdit () {
      if (this.isUserDataDisabled) {
        this.isUserDataDisabled = !this.isUserDataDisabled
        return
      }
      const changePath = process.env.VUE_APP_BASE_URL + ApiRoutes.CHANGE_USER_DATA.path
      axios.post(changePath, this.user, { headers: this.headers })
        .then(user => {
          console.log(user.data)
          this.user = user.data
          localStorage.setItem(localStorageKeys.NFL_TIPPER_USER, JSON.stringify(this.user))
          this.isUserDataDisabled = true
          // this.handleRegisterResponse(registerResp.data)
        })
    },
    changePassword () {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          SpinnerService.setSpinner(true)
          const changePath = process.env.VUE_APP_BASE_URL + ApiRoutes.CHANGE_PASSWORD.path
          axios.post(changePath, { oldPassword: this.oldPassword, newPassword: this.newPassword }, { headers: this.headers })
            .then(res => {
              if (res.data === ApiErrorMessages.USER.WRONG_USERNAME_OR_PASSWORD) {
                this.wrongOldPassword = true
              } else {
                this.wrongOldPassword = false
                this.token = res.data.token
                localStorage.setItem(localStorageKeys.NFL_TIPPER_TOKEN, this.token)
                this.hideModal('change-password')
              }
              SpinnerService.setSpinner(false)
            })
        }
      })
    },
    showModal (modal) {
      this.$modal.show(modal)
    },
    hideModal (modal) {
      this.$modal.hide(modal)
    }
  },
  mounted () {
    this.user = JSON.parse(localStorage.getItem(localStorageKeys.NFL_TIPPER_USER))
    this.token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
    this.headers = {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + this.token
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/_variables.scss';

.profile-header {
  font-size: 30pt;
}

.profile-container {
  width: 600px;
  margin: auto;
}
.user-data-container {
  margin-top: 50px;
}

.card-margin {
  margin-left: 5%;
  margin-top: 30px;
}

.button {
  background-color: rgb(65, 134, 83) !important;
  float: left;
}

.not-editable-input.md-field::after {
  height: 0px !important;
}

.avatar {
  max-width: 30px;
  max-height: 30px;
}

.modal {
  z-index: 2;
  background-color: yellow;
}

.card-margin {
  margin-left: 5%;
  margin-top: 30px;
}

</style>
