const DEFAULT_ERROR_MESSAGE = 'Unable to connect to server. Please try again later.'

const getErrorMessageFromPayload = (payload) => {
  if (!payload) return ''

  if (typeof payload === 'string') {
    return payload.trim()
  }

  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message.trim()
  }

  if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
    const firstError = payload.errors[0]
    if (typeof firstError === 'string' && firstError.trim()) {
      return firstError.trim()
    }
    if (typeof firstError?.message === 'string' && firstError.message.trim()) {
      return firstError.message.trim()
    }
  }

  return ''
}

export const normalizeApiError = (error) => {
  const status = Number(error?.response?.status) || 0
  const payload = error?.response?.data
  const payloadMessage = getErrorMessageFromPayload(payload)
  const fallbackMessage =
    error?.code === 'ECONNABORTED'
      ? 'The request timed out. Please try again.'
      : DEFAULT_ERROR_MESSAGE

  return {
    status,
    code: String(error?.code || ''),
    isNetworkError: !error?.response,
    message: payloadMessage || fallbackMessage,
    payload,
    originalError: error,
  }
}

export const getApiErrorMessage = (error, fallbackMessage = DEFAULT_ERROR_MESSAGE) => {
  const normalizedMessage = error?.normalized?.message
  if (typeof normalizedMessage === 'string' && normalizedMessage.trim()) {
    return normalizedMessage.trim()
  }

  const normalizedError = normalizeApiError(error)
  if (typeof normalizedError.message === 'string' && normalizedError.message.trim()) {
    return normalizedError.message.trim()
  }

  return fallbackMessage
}
