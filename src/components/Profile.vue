<template>
  <div class="md-layout">
    <form v-if="user" class="md-layout-item md-size-40 md-small-size-90 card-bg container-margin">
      <md-card class="card-bg">
        <md-card-header>
          <div class="name-and-avatar">
            <div class="md-title avatar-container">
              <img
                :src="user.avatarUrl ? user.avatarUrl : require('../assets/images/nfl-logo.png')"
                class="avatar">
            </div>
            <div class="username">{{ user.username }}</div>
          </div>
          <hr>
        </md-card-header>

        <md-card-content>
          <div v-if="user.isAdmin" class="admin-buttons">
            <div>
              <!-- <md-button
                class="md-primary md-raised material-button"
                @click="manualTrigger">
                Evaluate week
              </md-button> -->

              <!-- <md-button
                class="md-primary md-raised material-button"
                @click="createNewSeason">
                Create new season
              </md-button> -->

              <md-button
                class="md-primary md-raised material-button"
                @click="saveBackup">
                Save backup
              </md-button>
            </div>
            <div>
              <md-button
                class="md-primary md-raised material-button new-eval-button"
                @click="newEvaluation">
                New evaluation
              </md-button>

              <!-- <md-button
                class="md-primary md-raised material-button new-eval-button"
                @click="emergencyCreateNewWeek">
                Emergency create new week
              </md-button> -->
            </div>
          </div>
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
                  name="email"
                  type="text"
                  class="input-field input"
                  v-model="user.email"
                  disabled/>
              </md-field>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item md-small-size-100">
              <md-field md-clearable>
                <label for="first-name">Avatar URL</label>
                <md-input
                  name="avatar"
                  type="text"
                  ref="urlInput"
                  class="input-field avatar-input"
                  :class="{ 'url-editable': !isUserDataDisabled }"
                  v-model="user.avatarUrl"
                  :disabled="isUserDataDisabled"/>
              </md-field>

            </div>
          </div>
          <div
            v-if="isEditUnexpectedError"
            class="error-message">
            Unexpected error!
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
                        name="new-password"
                        type="password"
                        class="input-field"
                        v-validate="'required|min:8'"
                        v-model="newPassword"/>
                    </div>
                  </md-field>
                  <div class="error-message">{{ errors.first('new-password') }}</div>
                  <md-field>
                    <label class="label">New password again</label>
                    <div class="login-input">
                      <md-input
                        name="confirm-new-password"
                        class="input-field"
                        v-validate="'required|min:8'"
                        type="password"
                        v-model="confirmNewPassword"/>
                    </div>
                  </md-field>
                  <div class="error-message">{{ errors.first('confirm-new-password') }}</div>
                  <div
                    v-if="areNewPasswordsNotEqual"
                    class="error-message">
                    The entered passords are not equal!
                  </div>
                  <div
                    v-if="isUnexpectedError"
                    class="error-message">
                    Unexpected error!
                  </div>
                  <md-button
                    class="md-raised material-button"
                    @click="hideModal('change-password')">
                    Cancel
                  </md-button>
                  <md-button
                    class="md-primary md-raised material-button"
                    @click="changePassword">
                    Change
                  </md-button>
                </div>
              </modal>
              <md-button
                type="button"
                class="md-primary md-raised button material-button material-button"
                @click="onEdit">
                  {{ isUserDataDisabled ? 'Edit URL' : 'Save URL' }}
              </md-button>
              <md-button
                type="button"
                class="md-primary md-raised button material-button material-button"
                @click="onCanelEditing">
                  Cancel
              </md-button>
              <md-button
                type="button"
                class="md-primary md-raised material-button change-password"
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
import teamNamesMixin from '../mixins/teamNamesMixin'
import utilsMixin from '../mixins/utils'
import ApiErrorMessages from '../constants/api-response-messages'
import SpinnerService from '../services/SpinnerService'

export default {
  name: 'Profile',
  mixins: [validationMixin, teamNamesMixin, utilsMixin],
  data () {
    return {
      user: null,
      token: null,
      isUserDataDisabled: true,
      oldPassword: null,
      confirmNewPassword: null,
      newPassword: null,
      wrongOldPassword: null,
      currentAvatarUrl: null,
      isUnexpectedError: false,
      isEditUnexpectedError: false
    }
  },
  computed: {
    areNewPasswordsNotEqual () {
      if (this.newPassword && this.confirmNewPassword) {
        if (this.newPassword.length < 8 || this.confirmNewPassword.length < 8) {
          return null
        } else {
          return this.newPassword !== this.confirmNewPassword
        }
      }
      return null
    }
  },
  methods: {
    onEdit () {
      this.isEditUnexpectedError = false
      if (this.isUserDataDisabled) {
        this.isUserDataDisabled = !this.isUserDataDisabled
        this.currentAvatarUrl = this.user.avatarUrl
        this.$nextTick(function () {
          this.$refs['urlInput'].$el.focus()
        })
        return
      }
      SpinnerService.setSpinner(true)
      const changePath = process.env.VUE_APP_BASE_URL + ApiRoutes.CHANGE_USER_DATA.path
      axios.post(changePath, this.user, { headers: this.getHeader(this.token) })
        .then(user => {
          if (user.data === ApiErrorMessages.DATABASE.ERROR) {
            this.isEditUnexpectedError = true
            return
          }
          this.user = this.createUserToSave(user.data)
          localStorage.setItem(localStorageKeys.NFL_TIPPER_USER, JSON.stringify(this.user))
          this.isUserDataDisabled = true
          SpinnerService.setSpinner(false)
        })
        .catch(() => {
          SpinnerService.setSpinner(false)
        })
    },
    onCanelEditing () {
      this.isUserDataDisabled = true
      this.user.avatarUrl = this.currentAvatarUrl
    },
    changePassword () {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.hideErrorMessages()
          SpinnerService.setSpinner(true)
          const changePath = process.env.VUE_APP_BASE_URL + ApiRoutes.CHANGE_PASSWORD.path
          axios.post(
            changePath,
            {
              oldPassword: this.getNcryptedPassword(this.oldPassword),
              newPassword: this.getNcryptedPassword(this.newPassword)
            },
            { headers: this.getHeader(this.token) }
          )
            .then(res => {
              if (res.data === ApiErrorMessages.USER.WRONG_USERNAME_OR_PASSWORD) {
                this.wrongOldPassword = true
              } else if (res.data === ApiErrorMessages.DATABASE.ERROR) {
                this.isUnexpectedError = true
              } else {
                this.token = res.data.token
                localStorage.setItem(localStorageKeys.NFL_TIPPER_TOKEN, this.token)
                this.hideModal('change-password')
              }
              SpinnerService.setSpinner(false)
            })
            .catch(() => {
              SpinnerService.setSpinner(false)
            })
        }
      })
    },
    hideErrorMessages () {
      this.wrongOldPassword = false
      this.isUnexpectedError = false
    },
    showModal (modal) {
      this.$modal.show(modal)
    },
    hideModal (modal) {
      this.$modal.hide(modal)
    },
    manualTrigger () {
      SpinnerService.setSpinner(true)
      const changePath = process.env.VUE_APP_BASE_URL + ApiRoutes.MANUAL_TRIGGER.path
      axios.post(changePath, {}, { headers: this.getHeader(this.token) })
        .then(res => {
          SpinnerService.setSpinner(false)
          alert(res.data)
        })
        .catch(() => {
          SpinnerService.setSpinner(false)
        })
    },
    newEvaluation () {
      SpinnerService.setSpinner(true)
      const changePath = process.env.VUE_APP_BASE_URL + ApiRoutes.NEW_EVALUATE.path
      axios.post(changePath, {}, { headers: this.getHeader(this.token) })
        .then(res => {
          SpinnerService.setSpinner(false)
          alert(res.data)
        })
        .catch(() => {
          SpinnerService.setSpinner(false)
        })
    },
    emergencyCreateNewWeek () {
      SpinnerService.setSpinner(true)
      const changePath = process.env.VUE_APP_BASE_URL + ApiRoutes.NEW_EVALUATE.path
      axios.post(changePath, {}, { headers: this.getHeader(this.token) })
        .then(res => {
          SpinnerService.setSpinner(false)
          alert(res.data)
        })
        .catch(() => {
          SpinnerService.setSpinner(false)
        })
    },
    createNewSeason () {
      SpinnerService.setSpinner(true)
      const changePath = process.env.VUE_APP_BASE_URL + ApiRoutes.CREATE_NEW_SEASON.path
      axios.post(changePath, {}, { headers: this.getHeader(this.token) })
        .then(res => {
          SpinnerService.setSpinner(false)
          alert(res.data)
        })
        .catch(() => {
          SpinnerService.setSpinner(false)
        })
    },
    saveBackup () {
      SpinnerService.setSpinner(true)
      const changePath = process.env.VUE_APP_BASE_URL + ApiRoutes.SAVE_BACKUP.path
      axios.post(changePath, {}, { headers: this.getHeader(this.token) })
        .then(res => {
          SpinnerService.setSpinner(false)
          alert(res.data)
        })
        .catch(() => {
          SpinnerService.setSpinner(false)
        })
    }
  },
  mounted () {
    this.user = JSON.parse(localStorage.getItem(localStorageKeys.NFL_TIPPER_USER))
    this.token = localStorage.getItem(localStorageKeys.NFL_TIPPER_TOKEN)
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
.change-password {
  background-color: rgb(165, 141, 35) !important;
  float: right;
}
.not-editable-input.md-field::after {
  height: 0px !important;
}
.name-and-avatar {
  display: flex;
}
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  height: 100px;
}
.avatar {
  max-width: 100px;
  max-height: 100px;
}
.username {
  width: 100%;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-margin {
  margin-left: 5%;
  margin-top: 30px;
}
.team-logo {
  width: 80px;
}
.team-name {
  margin-left: 10px;
  font-size: 16px;
}
.url-editable {
  background-color: rgb(207, 207, 202) !important;
}
.avatar-input {
  margin: 0;
  padding-left: 5px;
}
.admin-buttons {
  margin-bottom: 20px;
}
.new-eval-button {
  background-color: purple !important;
}
</style>
