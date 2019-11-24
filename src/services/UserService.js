import * as axios from 'axios'
import { ApiRoutes } from '../utils/ApiRoutes'

class UserService {
  static user = null

  static getUser (user) {
    axios.post(process.env.VUE_APP_BASE_URL + ApiRoutes.GET_USER.path, user)
      .then(response => {
        this.user = response.data
        console.log(response.data)
        localStorage.setItem('user', JSON.stringify(response.data))
      })
  }
}

export default UserService
