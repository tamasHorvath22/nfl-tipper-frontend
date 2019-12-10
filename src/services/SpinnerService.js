class SpinnerService {
    subscriptions = []

    subscribe (callback) {
      this.subscriptions.push(callback)
    }

    notify (context) {
      this.subscriptions.forEach(function (callback) {
        callback(context)
      })
    }
}

export default SpinnerService
