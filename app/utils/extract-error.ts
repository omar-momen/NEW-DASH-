function getErrorMessage(error: Record<string, unknown> | string | undefined): string {
  if (!error) {
    return useNuxtApp().$i18n?.t('an_error_occurred')
  }
  if (typeof error === 'string') {
    return error
  }
  return (error.detail || error.message || useNuxtApp().$i18n?.t('an_error_occurred')) as string
}

function formatErrorItem(error: Record<string, unknown>, index: number) {
  return {
    key: (error?.key || error?.field || `error_${index}`) as string,
    message: getErrorMessage(error)
  }
}

function formatMessageItem(message: Record<string, unknown> | string, index: number) {
  return {
    key: `message_${index}`,
    message: getErrorMessage(message)
  }
}

export function extractError(data: Record<string, unknown>) {
  // Check for errors array
  if (data?.error && Array.isArray(data.error) && data.error.length > 0) {
    return data.error.length === 1
      ? getErrorMessage(data.error[0])
      : data.error.map(formatErrorItem)
  }

  // Check for single error object
  if (data?.error && typeof data.error === 'object' && !Array.isArray(data.error)) {
    return getErrorMessage(data.error as Record<string, unknown>)
  }

  // Check for messages array
  if (data?.messages && Array.isArray(data.messages) && data.messages.length > 0) {
    return data.messages.length === 1
      ? getErrorMessage(data.messages[0])
      : data.messages.map(formatMessageItem)
  }

  // Check for direct message or detail property
  if (data?.message) {
    return data.message as string
  }
  if (data?.detail) {
    return data.detail as string
  }

  return useNuxtApp().$i18n?.t('an_error_occurred')
}
