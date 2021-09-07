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
  CONFIRM_EMAIL: {
    path: '/confirm-email/:hash',
    name: 'CONFIRM_EMAIL'
  },
  RESET_PASSWORD: {
    path: '/reset-password/:hash',
    name: 'RESET_PASSWORD'
  },
  CHECK_PASS_TOKEN: {
    path: '/check-pass-token',
    name: 'CHECK_PASS_TOKEN'
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
  LEAGUE: {
    path: '/league/:leagueId',
    name: 'LEAGUE'
  },
  LEAGUES: {
    path: '/leagues',
    name: 'LEAGUES'
  },
  RULES: {
    path: '/rules',
    name: 'RULES'
  }
}
