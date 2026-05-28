export const categoriesRoutes = [
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('./pages/Categories.vue'),
    meta: {
      title: 'Categories',
      requiresAuth: true,
      permission: 'categories.view',
    },
  },
]
