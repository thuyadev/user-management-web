export const authRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('./pages/Login.vue'),
    meta: {
      title: 'Login',
      requiresAuth: false,
    },
  },
]
