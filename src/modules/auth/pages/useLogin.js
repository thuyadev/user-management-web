import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '../store'

export const useLogin = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const loading = ref(false)
  const formState = reactive({
    email: import.meta.env.VITE_DEFAULT_ADMIN_EMAIL || '',
    password: import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD || '',
  })

  const rules = {
    email: [
      { required: true, message: 'Please enter your email', trigger: 'blur' },
      { type: 'email', message: 'Please enter a valid email', trigger: 'blur' },
    ],
    password: [
      { required: true, message: 'Please enter your password', trigger: 'blur' },
      { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
    ],
  }

  const handleLogin = async () => {
    try {
      loading.value = true
      const result = await authStore.loginUser(formState.email, formState.password)

      if (!result.success) {
        message.error(result.message || 'Login failed. Please try again.')
        return
      }

      message.success(result.message || 'Login successful!')
      router.replace('/dashboard')
    } catch (error) {
      message.error('An error occurred. Please try again.')
      console.error('Login error:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    formState,
    rules,
    handleLogin,
  }
}
