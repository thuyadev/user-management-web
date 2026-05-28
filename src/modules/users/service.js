import { apiClient } from '@/api/client'
import { getApiErrorMessage } from '@/utils/apiError'
import { parseApiResult, parsePaginatedResult } from '@/utils/apiResponse'

export const listUsers = async (params = {}) => {
  try {
    const { data: result } = await apiClient.get('/api/v1/admin/users', { params })
    return parsePaginatedResult(result, 'Failed to load users.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const getUser = async (id) => {
  try {
    const { data: result } = await apiClient.get(`/api/v1/admin/users/${id}`)
    return parseApiResult(result, 'Failed to load user.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const createUser = async (payload) => {
  try {
    const { data: result } = await apiClient.post('/api/v1/admin/users', payload)
    return parseApiResult(result, 'Failed to create user.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const updateUser = async (id, payload) => {
  try {
    const { data: result } = await apiClient.put(`/api/v1/admin/users/${id}`, payload)
    return parseApiResult(result, 'Failed to update user.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const deleteUser = async (id) => {
  try {
    const { data: result } = await apiClient.delete(`/api/v1/admin/users/${id}`)
    return parseApiResult(result, 'Failed to delete user.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}
