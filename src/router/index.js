import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from '@/modules/auth/route'
import { dashboardRoutes } from '@/modules/dashboard/route'
import { usersRoutes } from '@/modules/users/route'
import { categoriesRoutes } from '@/modules/categories/route'
import { productsRoutes } from '@/modules/products/route'
import { logsRoutes } from '@/modules/logs/route'
import { errorRoutes } from '@/modules/errors/route'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    ...authRoutes,
    ...dashboardRoutes,
    ...usersRoutes,
    ...categoriesRoutes,
    ...productsRoutes,
    ...logsRoutes,
    ...errorRoutes,
  ],
})

export default router
