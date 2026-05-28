import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login, getCurrentUser } from './service'
import { hasPermission as checkPermission } from '@/utils/permissions'

export const useAuthStore = defineStore('auth', () => {
  const AUTH_TOKEN_KEY = 'auth_token'
  const USER_KEY = 'user'
  const PERMISSIONS_KEY = 'permissions'
  const ROLE_KEY = 'role'
  const EXPIRES_AT_KEY = 'expires_at'

  const user = ref(null)
  const token = ref(null)
  const role = ref(null)
  const permissions = ref([])
  const expiresAt = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const hasPermission = (permission) => checkPermission(permissions.value, permission)

  const persistAuth = () => {
    localStorage.setItem(AUTH_TOKEN_KEY, token.value)
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions.value))
    localStorage.setItem(ROLE_KEY, role.value || '')
    if (expiresAt.value) {
      localStorage.setItem(EXPIRES_AT_KEY, expiresAt.value)
    }
  }

  const clearPersistedAuth = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(PERMISSIONS_KEY)
    localStorage.removeItem(ROLE_KEY)
    localStorage.removeItem(EXPIRES_AT_KEY)
  }

  const mapProfileFromMe = (data, existingUser = null) => {
    if (!data) return existingUser

    if (data.user) {
      return data.user
    }

    return {
      id: data.user_id ?? existingUser?.id ?? null,
      name: existingUser?.name || data.email,
      email: data.email ?? existingUser?.email,
      role: data.role ?? existingUser?.role,
    }
  }

  function setAuth(authData) {
    user.value = authData.user
    token.value = authData.token
    role.value = authData.role
    permissions.value = authData.permissions || []
    expiresAt.value = authData.expires_at || null
    persistAuth()
  }

  function logout() {
    user.value = null
    token.value = null
    role.value = null
    permissions.value = []
    expiresAt.value = null
    clearPersistedAuth()
  }

  function initAuth() {
    const persistedToken = localStorage.getItem(AUTH_TOKEN_KEY)
    const persistedUser = localStorage.getItem(USER_KEY)

    if (persistedToken && persistedUser) {
      token.value = persistedToken
      user.value = JSON.parse(persistedUser)
      role.value = localStorage.getItem(ROLE_KEY) || user.value?.role || null

      const rawPermissions = localStorage.getItem(PERMISSIONS_KEY)
      permissions.value = rawPermissions ? JSON.parse(rawPermissions) : []
      expiresAt.value = localStorage.getItem(EXPIRES_AT_KEY) || null
    }
  }

  const loginUser = async (email, password) => {
    try {
      const response = await login(email, password)

      if (!response.success || !response.data?.token) {
        return {
          success: false,
          message: response.message || 'Login failed. Please try again.',
        }
      }

      setAuth(response.data)

      return {
        success: true,
        message: response.message || 'Login successful.',
      }
    } catch (error) {
      console.error('LoginUser error:', error)
      return {
        success: false,
        message: 'An error occurred. Please try again.',
      }
    }
  }

  const refreshCurrentUser = async () => {
    if (!token.value) {
      return { success: false, message: 'No auth token available.' }
    }

    try {
      const meResponse = await getCurrentUser()

      if (meResponse.success && meResponse.data) {
        user.value = mapProfileFromMe(meResponse.data, user.value)
        role.value = meResponse.data.role || user.value?.role
        permissions.value = meResponse.data.permissions || permissions.value
        persistAuth()
        return { success: true, message: meResponse.message || 'Profile refreshed.' }
      }

      return {
        success: false,
        message: meResponse.message || 'Failed to refresh profile.',
      }
    } catch (error) {
      console.error('refreshCurrentUser error:', error)
      return {
        success: false,
        message: error?.normalized?.message || 'An error occurred while refreshing profile.',
      }
    }
  }

  return {
    user,
    token,
    role,
    permissions,
    expiresAt,
    isAuthenticated,
    hasPermission,
    setAuth,
    logout,
    initAuth,
    loginUser,
    refreshCurrentUser,
  }
})
