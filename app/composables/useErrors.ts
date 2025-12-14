import type { ErrorDetails } from '~/types'

type ErrorInput = Partial<ErrorDetails> | string
type ErrorDestination = 'error_page' | 'toast' | ''

export const useErrors = () => {
  const error = useState<ErrorDetails | null>('error:current', () => null)
  const nuxtError = useError()

  const getErrorMessage = (errorInput: ErrorInput): string => {
    const { t } = useI18n()

    if (typeof errorInput === 'string') {
      return errorInput
    }
    return errorInput?.message || t('an_error_occurred') || 'An error occurred'
  }

  const setError = (errorInput: ErrorInput, destination: ErrorDestination = '') => {
    const message = getErrorMessage(errorInput)

    const errorDetails: ErrorDetails = typeof errorInput === 'string'
      ? { message }
      : {
          message,
          statusCode: errorInput?.statusCode,
          statusMessage: errorInput?.statusMessage,
          stack: errorInput?.stack,
          data: errorInput?.data,
          url: errorInput?.url
        }

    error.value = errorDetails

    if (destination === 'error_page') {
      nuxtError.value = createError({
        statusCode: errorDetails.statusCode,
        statusMessage: errorDetails.statusMessage,
        message: errorDetails.message,
        data: errorDetails.data,
        fatal: true
      })
    } else if (destination === 'toast') {
      useToast().add({
        title: 'Error',
        description: message,
        color: 'error'
      })
    }
  }

  const clearError = () => {
    nuxtError.value = undefined
    error.value = null
  }

  return {
    currentError: readonly(error),
    error: readonly(error),
    setError,
    clearError
  }
}
