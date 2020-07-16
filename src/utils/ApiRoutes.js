export const ApiRoutes = {
  LOGIN: {
    path: '/login',
    name: 'LOGIN'
  },
  REGISTER: {
    path: '/register',
    name: 'REGISTER'
  },
  CHANGE_USER_DATA: {
    path: '/api/user/change',
    name: 'CHANGE_USER_DATA'
  },
  GET_USER: {
    path: '/api/get-user',
    name: 'GET_USER'
  },
  CREATE_LEAGUE: {
    path: '/api/league',
    name: 'CREATE_LEAGUE'
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
  }
}
