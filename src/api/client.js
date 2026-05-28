import axios from 'axios'
import { normalizeApiError } from '@/utils/apiError'

const resolveEnvValue = (value, fallback = '') => {
  const normalizedValue = String(value || '').trim()
  return normalizedValue || fallback
}

const rawBaseUrl = resolveEnvValue(import.meta.env.VITE_API_BASE_URL)
export const BASE_URL = rawBaseUrl.replace(/\/+$/, '')
const apiKey = resolveEnvValue(import.meta.env.VITE_API_KEY)
const apiKeyHeader = resolveEnvValue(import.meta.env.VITE_API_KEY_HEADER, 'X-API-Key')

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let authTokenGetter = () => null

export const setAuthTokenGetter = (getter) => {
  authTokenGetter = typeof getter === 'function' ? getter : () => null
}

apiClient.interceptors.request.use((config) => {
  if (apiKey) {
    config.headers[apiKeyHeader] = apiKey
  }

  const token = authTokenGetter()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeApiError(error)
    error.normalized = normalizedError

    if (normalizedError.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('api:unauthorized', {
          detail: normalizedError,
        })
      )
    }

    return Promise.reject(error)
  }
)
