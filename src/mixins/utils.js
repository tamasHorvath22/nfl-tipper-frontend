export default {
  data () {
    return {
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  },
  methods: {
    twoDigits (num) {
      return num >= 0 && num < 10 ? `0${num}` : num.toString()
    },
    getMonthName (index) {
      return this.monthNames[index]
    }
  }
}
