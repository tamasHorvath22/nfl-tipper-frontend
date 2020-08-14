import utilsMixin from './utils'

export default {
  mixins: [utilsMixin],
  data () {
    return {}
  },
  methods: {
    getLeagueAvatar (avatarUrl) {
      return this.notNullOrUndefinded(avatarUrl) ? avatarUrl : require('../assets/images/nfl-logo.png')
    }
  }
}
