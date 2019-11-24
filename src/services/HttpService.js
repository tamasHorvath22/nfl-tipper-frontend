import * as axios from 'axios'

class HttpService {
  BASE_URL = process.env.BASE_URL

  async get (url, data) {
    const response = await axios.get(url, data)
    return response
  }

  async post (url, data) {
    const response = await axios.post(url, data)
    return response
  }
}

export default new HttpService()
