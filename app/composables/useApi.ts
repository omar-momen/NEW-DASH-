import { useFetch, useNuxtApp } from 'nuxt/app'
import type { ExtendedFetchOptions } from '~/types'

/**
 * PLEASE DON'T CHANGE THIS FILE
 */
export function useApi<T>(
  url: string | (() => string),
  options: ExtendedFetchOptions<T> = {}
) {
  const { $api } = useNuxtApp()

  return useFetch(url, {
    ...options,
    $fetch: $api
  })
}
