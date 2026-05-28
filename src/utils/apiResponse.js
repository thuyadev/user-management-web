/**
 * Parse standard API responses: { success, message, data }
 */
export const parseApiResult = (result, fallbackMessage) => {
  if (result?.success) {
    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  }

  return {
    success: false,
    message: result?.message || fallbackMessage,
  }
}

/**
 * Parse paginated list responses per Postman contract:
 * { success, data: [...items], meta: { total, page, per_page, total_pages } }
 */
export const parsePaginatedResult = (result, fallbackMessage) => {
  if (!result?.success) {
    return {
      success: false,
      message: result?.message || fallbackMessage,
    }
  }

  return {
    success: true,
    data: Array.isArray(result.data) ? result.data : [],
    meta: result.meta || {},
    message: result.message,
  }
}

export const getPaginationTotal = (response) => {
  if (!response?.success) return 0
  return Number(response.meta?.total) || 0
}
