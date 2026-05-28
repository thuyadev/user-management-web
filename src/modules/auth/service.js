import { apiClient } from '@/api/client'
import { getApiErrorMessage } from '@/utils/apiError'
import { parseApiResult } from '@/utils/apiResponse'

export const login = async (email, password) => {
  try {
    const { data: result } = await apiClient.post('/api/v1/auth/login', {
      email,
      password,
    })

    const parsed = parseApiResult(result, 'Invalid email or password')

    if (parsed.success && parsed.data?.token) {
      return {
        success: true,
        data: parsed.data,
        message: parsed.message || 'Login successful.',
      }
    }

    return {
      success: false,
      message: parsed.message || 'Invalid email or password',
    }
  } catch (error) {
    console.error('Login API error:', error)
    return {
      success: false,
      message: getApiErrorMessage(error),
    }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: result } = await apiClient.get('/api/v1/auth/me')
    return parseApiResult(result, 'Failed to load user profile.')
  } catch (error) {
    console.error('Get current user API error:', error)
    return {
      success: false,
      message: getApiErrorMessage(error),
    }
  }
}
