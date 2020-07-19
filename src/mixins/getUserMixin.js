import { ApiRoutes } from '../utils/ApiRoutes'
import localStorageKeys from '../constants/localStorageKeys'
import SpinnerService from '../services/SpinnerService'
import * as axios from 'axios'

const getUserMixin = {
  methods: {
    async saveUserToLocalStorage (token) {
      SpinnerService.setSpinner(true)
      const headers = {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + token
      }
      const userResponse = await axios.post(process.env.VUE_APP_BASE_URL + ApiRoutes.GET_USER.path, {}, { headers: headers })
      const userToSave = {
        username: userResponse.data.username,
        userId: userResponse.data._id,
        email: userResponse.data.email,
        leagues: userResponse.data.leagues,
        invitations: userResponse.data.invitations
      }
      localStorage.setItem(localStorageKeys.NFL_TIPPER_USER, JSON.stringify(userToSave))
      SpinnerService.setSpinner(false)
    }
  }
}

export default getUserMixin
