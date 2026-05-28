import { apiClient } from '@/api/client'
import { getApiErrorMessage } from '@/utils/apiError'
import { parseApiResult, parsePaginatedResult } from '@/utils/apiResponse'

export const listProducts = async (params = {}) => {
  try {
    const { data: result } = await apiClient.get('/api/v1/admin/products', { params })
    return parsePaginatedResult(result, 'Failed to load products.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const getProduct = async (id) => {
  try {
    const { data: result } = await apiClient.get(`/api/v1/admin/products/${id}`)
    return parseApiResult(result, 'Failed to load product.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const createProduct = async (payload) => {
  try {
    const { data: result } = await apiClient.post('/api/v1/admin/products', payload)
    return parseApiResult(result, 'Failed to create product.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const updateProduct = async (id, payload) => {
  try {
    const { data: result } = await apiClient.put(`/api/v1/admin/products/${id}`, payload)
    return parseApiResult(result, 'Failed to update product.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const deleteProduct = async (id) => {
  try {
    const { data: result } = await apiClient.delete(`/api/v1/admin/products/${id}`)
    return parseApiResult(result, 'Failed to delete product.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}
