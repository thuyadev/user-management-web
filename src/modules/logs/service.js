import { apiClient } from '@/api/client'
import { getApiErrorMessage } from '@/utils/apiError'
import { parseApiResult, parsePaginatedResult } from '@/utils/apiResponse'

export const listLogs = async (params = {}) => {
  try {
    const { data: result } = await apiClient.get('/api/v1/admin/logs', { params })
    return parsePaginatedResult(result, 'Failed to load activity logs.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

const parseStatsResult = (result, fallbackMessage) => {
  const parsed = parseApiResult(result, fallbackMessage)

  if (parsed.success) {
    parsed.data = Array.isArray(parsed.data) ? parsed.data : []
  }

  return parsed
}

export const getEventStats = async (params = {}) => {
  try {
    const { data: result } = await apiClient.get('/api/v1/admin/logs/stats/events', { params })
    return parseStatsResult(result, 'Failed to load event statistics.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}

export const getDailyStats = async (params = {}) => {
  try {
    const { data: result } = await apiClient.get('/api/v1/admin/logs/stats/daily', { params })
    return parseStatsResult(result, 'Failed to load daily statistics.')
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) }
  }
}
