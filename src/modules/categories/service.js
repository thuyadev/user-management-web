import { apiClient } from '@/api/client'
import { getApiErrorMessage } from '@/utils/apiError'
import { parseApiResult, parsePaginatedResult } from '@/utils/apiResponse'

export const listCategories = async (params = {}) => {
  try {
    const { data: result } = await apiClient.get('/api/v1/admin/categories', { params })
    return parsePaginatedResult(result, 'Failed to load categories.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const getCategory = async (id) => {
  try {
    const { data: result } = await apiClient.get(`/api/v1/admin/categories/${id}`)
    return parseApiResult(result, 'Failed to load category.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const createCategory = async (payload) => {
  try {
    const { data: result } = await apiClient.post('/api/v1/admin/categories', payload)
    return parseApiResult(result, 'Failed to create category.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const updateCategory = async (id, payload) => {
  try {
    const { data: result } = await apiClient.put(`/api/v1/admin/categories/${id}`, payload)
    return parseApiResult(result, 'Failed to update category.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const deleteCategory = async (id) => {
  try {
    const { data: result } = await apiClient.delete(`/api/v1/admin/categories/${id}`)
    return parseApiResult(result, 'Failed to delete category.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const suggestCategoryName = async (keywords) => {
  try {
    const { data: result } = await apiClient.post('/api/v1/admin/categories/ai/suggest', {
      keywords,
    })
    return parseApiResult(result, 'Failed to suggest category name.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}
