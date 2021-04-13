export default (components = {}) => [
  {
    path: '/games',
    exact: true,
    component: components.PHome
  },
  {
    path: '/',
    exact: true,
    component: components.PAbout
  },
  {
    path: '/login',
    exact: true,
    component: components.PLogin
  },
  {
    path: '/createGame',
    exact: true,
    component: components.PGameCreate
  },
  {
    path: '/game/:gameId',
    exact: true,
    component: components.PGame
  },
  {
    path: '/past-games',
    exact: true,
    component: components.PPastGames
  },
]
