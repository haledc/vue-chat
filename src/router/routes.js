export default [
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    component: () => import('pages/login')
  },

  {
    path: '/register',
    component: () => import('pages/register')
  },

  {
    path: '/update-info/:type',
    component: () => import('pages/update-info')
  },

  {
    path: '*',
    component: () => import('pages/404')
  }
]
