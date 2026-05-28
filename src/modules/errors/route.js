export const errorRoutes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./pages/NotFound.vue'),
    meta: {
      title: '404',
      requiresAuth: false,
    },
  },
]
