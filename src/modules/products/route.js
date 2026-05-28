export const productsRoutes = [
  {
    path: '/products',
    name: 'Products',
    component: () => import('./pages/Products.vue'),
    meta: {
      title: 'Products',
      requiresAuth: true,
      permission: 'products.view',
    },
  },
]
