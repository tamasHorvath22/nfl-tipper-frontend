export const Routes = {
  LOGIN: {
    path: '/login',
    name: 'LOGIN'
  },
  REGISTER: {
    path: '/register',
    name: 'REGISTER'
  },
  CHECK_BEFORE_REGISTER: {
    path: '/user-check',
    name: 'USER_CHECK'
  }

  // getPackageSelectorUrlForGroupCode (groupCode) {
  //   return this.PACKAGE_SELECTOR.path.replace(':groupCode', groupCode)
  // },

  // defaultPackageSelector () {
  //   return this.PACKAGE_SELECTOR.path.replace(':groupCode', ProductGroupCode.TRUCK)
  // },

  // home () {
  //   return this.defaultPackageSelector()
  // }
}
