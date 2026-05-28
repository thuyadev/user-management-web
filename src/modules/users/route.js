export const usersRoutes = [
  {
    path: '/users',
    name: 'Users',
    component: () => import('./pages/Users.vue'),
    meta: {
      title: 'Users',
      requiresAuth: true,
      permission: 'users.manage',
    },
  },
]
