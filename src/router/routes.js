export default [
  {path: '/', redirect: '/login'},

  {path: '/login', component: () => import('pages/login')},

  {path: '/register', component: () => import('pages/register')},

  {path: '/update-info/:type', component: () => import('pages/update-info')},

  {
    path: '/dashboard',
    component: () => import('layouts/default'),
    children: [
      {path: 'genius', component: () => import('pages/genius')},
      {path: 'boss', component: () => import('pages/boss')},
      {path: 'msg', component: () => import('pages/msg')},
      {path: 'user-center', component: () => import('pages/user-center')}
    ]
  },

  {path: '/chat/:target', component: () => import('pages/chat')},

  {path: '*', component: () => import('pages/404')}
]
