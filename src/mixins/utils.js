import CryptoJS from 'crypto-js'
import { ApiRoutes } from '../utils/ApiRoutes'
import * as axios from 'axios'
import localStorageKeys from '../constants/localStorageKeys'
import ApiErrorMessages from '../constants/api-response-messages'

export default {
  data () {
    return {
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      barColors: ['#494368', '#FC60A8', '#F0976A', '#7A28CB', '#6F9B1C']
    }
  },
  methods: {
    twoDigits (num) {
      return num >= 0 && num < 10 ? `0${num}` : num.toString()
    },
    getMonthName (index) {
      return this.monthNames[index]
    },
    getDayName (index) {
      return this.weekdays[index]
    },
    romanize (num) {
      if (isNaN(num)) {
        return NaN
      }
      let digits = String(+num).split('')
      const key = [
        '', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
        '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
        '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
      let roman = ''
      let i = 3
      while (i--) {
        roman = (key[+digits.pop() + (i * 10)] || '') + roman
      }
      return Array(+digits.join('') + 1).join('M') + roman
    },
    notNullOrUndefinded (item) {
      return item !== null && item !== undefined
    },
    createUserToSave (userResponse) {
      return {
        username: userResponse.username,
        userId: userResponse._id,
        email: userResponse.email,
        leagues: userResponse.leagues,
        invitations: userResponse.invitations,
        avatarUrl: userResponse.avatarUrl,
        isAdmin: userResponse.isAdmin
      }
    },
    getNcryptedPassword (password) {
      return CryptoJS.AES.encrypt(
        password,
        process.env.VUE_APP_PASSWORD_SECRET_KEY
      ).toString()
    },
    async getUserAndSaveToLocalstorage () {
      try {
        const userResponse = await axios.post(
          `${process.env.VUE_APP_BASE_URL}${ApiRoutes.GET_USER.path}`,
          null,
          { headers: this.headers }
        )
        if (userResponse.data === ApiErrorMessages.USER.NOT_FOUND) {
          throw new Error('get user error')
        }
        localStorage.setItem(
          localStorageKeys.NFL_TIPPER_USER,
          JSON.stringify(this.createUserToSave(userResponse.data))
        )
      } catch (err) {
        throw new Error('get user error')
      }
    },
    getHeader (token) {
      return {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    }
  }
}
