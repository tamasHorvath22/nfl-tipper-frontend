export const Routes = {
  ROOT: {
    path: '/',
    name: 'ROOT'
  },
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
  },
  PROFILE: {
    path: '/profile',
    name: 'PROFILE'
  },
  JOIN_LEAGUE: {
    path: '/join-league/:token',
    name: 'JOIN_LEAGUE'
  },
  LEAGUES: {
    path: '/leagues/:leagueId',
    name: 'LEAGUES'
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
