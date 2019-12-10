class SpinnerService {
    static subscriptions = []

    static subscribe (callback) {
      this.subscriptions.push(callback)
    }

    static setSpinner (context) {
      this.subscriptions.forEach(function (callback) {
        callback(context)
      })
    }
}

export default SpinnerService
