import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import { message } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/modules/auth/store'
import { setAuthTokenGetter } from '@/api/client'
import { PERMISSIONS } from '@/utils/permissions'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const authStore = useAuthStore(pinia)
authStore.initAuth()
setAuthTokenGetter(() => authStore.token)

if (typeof window !== 'undefined') {
  window.addEventListener('api:unauthorized', () => {
    if (!authStore.isAuthenticated) return
    authStore.logout()
    if (router.currentRoute.value.meta?.requiresAuth) {
      router.replace('/login')
    }
  })
}

router.beforeEach((to) => {
  const publicPages = ['/login']

  if (to.meta?.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  if (publicPages.includes(to.path) && authStore.isAuthenticated) {
    return '/dashboard'
  }

  if (to.meta?.permission && !authStore.hasPermission(to.meta.permission)) {
    message.warning('You do not have permission to access this page.')
    return '/dashboard'
  }

  return true
})

app.use(router)
app.use(Antd)

app.config.errorHandler = (error, instance, info) => {
  console.error('Unhandled Vue error:', { error, instance, info })
  message.error('Something went wrong. Please try again.')
}

app.mount('#app')

export { PERMISSIONS }
