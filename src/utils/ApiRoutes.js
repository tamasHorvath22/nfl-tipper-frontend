export const ApiRoutes = {
  LOGIN: {
    path: '/login',
    name: 'LOGIN'
  },
  REGISTER: {
    path: '/register',
    name: 'REGISTER'
  },
  CONFIRM_EMAIL: {
    path: '/confirm-email',
    name: 'CONFIRM_EMAIL'
  },
  RESET_PASSWORD: {
    path: '/reset-password',
    name: 'RESET_PASSWORD'
  },
  NEW_PASSWORD: {
    path: '/new-password',
    name: 'NEW_PASSWORD'
  },
  CHECK_PASS_HASH: {
    path: '/check-pass-token',
    name: 'CHECK_PASS_HASH'
  },
  CHANGE_USER_DATA: {
    path: '/api/user/change',
    name: 'CHANGE_USER_DATA'
  },
  GET_USER: {
    path: '/api/get-user',
    name: 'GET_USER'
  },
  CHANGE_PASSWORD: {
    path: '/api/change-pass',
    name: 'CHANGE_PASSWORD'
  },
  CREATE_LEAGUE: {
    path: '/api/league',
    name: 'CREATE_LEAGUE'
  },
  GET_SEASON: {
    path: '/api/league/get-season',
    name: 'GET_SEASON'
  },
  SAVE_BETS: {
    path: '/api/league/save-week-bets',
    name: 'SAVE_BETS'
  },
  LEAGUE_INVITATION: {
    path: '/api/league/invite',
    name: 'LEAGUE_INVITATION'
  },
  DELETE_LEAGUE_INVITATION: {
    path: '/api/league/delete-invite',
    name: 'DELETE_LEAGUE_INVITATION'
  },
  ACCEPT_LEAGUE_INVITATION: {
    path: '/api/accept-league-invitation',
    name: 'ACCEPT_LEAGUE_INVITATION'
  },
  GET_LEAGUES: {
    path: '/api/get-leagues',
    name: 'GET_LEAGUES'
  },
  GET_LEAGUE: {
    path: '/api/get-league',
    name: 'GET_LEAGUE'
  },
  MANUAL_TRIGGER: {
    path: '/api/league/week-close-manually',
    name: 'MANUAL_TRIGGER'
  },
  CREATE_NEW_SEASON: {
    path: '/api/league/create-new-season',
    name: 'CREATE_NEW_SEASON'
  }
}
