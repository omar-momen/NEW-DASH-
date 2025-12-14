import type { FetchContext } from 'ofetch'
import type { ExtendedResolvedFetchOptions } from '~/types'
import { I18N_LANG } from '~/enums'
import { extractError } from '~/utils'

// Composables in plugins should be imported
import { useLoading } from '~/composables/useLoading'
import { useErrors } from '~/composables/useErrors'

/** handle on un-authenticated user */
async function handleUnAuthenticated(response: Response) {
  if (response?.status !== 401) {
    return
  }

  const { logout } = useAuth()
  await logout()

  const localePath = useLocalePath()
  navigateTo(localePath('/'), { redirectCode: 401 })

  return useToast().add({
    title: 'Unauthenticated',
    description: 'You are not authenticated',
    color: 'error'
  })
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const { incrementPendingRequests, decrementPendingRequests } = useLoading()
  const { setError } = useErrors()

  const baseURL = computed<string>(() => config.public.apiBaseUrl || '')

  const api = $fetch.create({
    baseURL: baseURL.value,
    onRequest(ctx: FetchContext) {
      const options = ctx.options as ExtendedResolvedFetchOptions
      incrementPendingRequests()

      const { token } = useAuth()
      const { locale } = nuxtApp.$i18n as { locale: Ref<string> }

      // add headers is a key we pass to indicate that we don't want to add headers
      if (!options?.noHeaders) {
        if (token.value) {
          options.headers.set('Authorization', `Bearer ${token.value}`)
        }
        options.headers.set('Accept-Language', I18N_LANG[locale.value as keyof typeof I18N_LANG])
        if (!options.headers.has('Accept')) {
          options.headers.set('Accept', 'application/json')
        }

        // const appDataStore = useAppStore()
        // if (appDataStore.appData?.key) {
        //   options.headers.set('tenant-key', appDataStore.appData?.key || '')
        // }
      }
    },

    async onRequestError() {
      decrementPendingRequests()
    },

    async onResponse() {
      decrementPendingRequests()
    },

    async onResponseError(ctx: FetchContext) {
      const request = ctx.request
      const response = ctx.response
      const options = ctx.options as ExtendedResolvedFetchOptions

      // Handle unauthenticated globally except for login/auth requests (401)
      const requestUrl = typeof request === 'string' ? request : request?.url
      const isLoginOrAuthFlow = requestUrl?.includes('/auth')
      if (response?.status === 401) {
        if (!isLoginOrAuthFlow) {
          await handleUnAuthenticated(response)
          return
        }
      }

      const errorResult = extractError(response?._data as Record<string, unknown>)
      const errorMessage = Array.isArray(errorResult) ? errorResult[0]?.message : errorResult

      // Only show toast in development
      setError({
        message: errorMessage,
        statusCode: response?.status,
        url: typeof request === 'string' ? request : undefined,
        data: response?._data,
        stack: response?._data?.stack
      }, options.silent ? '' : 'toast')
    }
  })

  return {
    provide: {
      api
    }
  }
})
