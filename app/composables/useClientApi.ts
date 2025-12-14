import { ref, shallowRef } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { ApiRequestError, ExtendedNitroFetchOptions } from '~/types'

export async function useClientApi<T>(url: string, options: ExtendedNitroFetchOptions<T> = {}) {
  const { $api } = useNuxtApp()
  const data = shallowRef<T | null>(null)
  const error = shallowRef<ApiRequestError | null>(null)
  const pending = ref<boolean>(false)

  const fetchData = async () => {
    pending.value = true
    error.value = null
    try {
      data.value = await $api<T>(url, options as unknown as NitroFetchOptions<NitroFetchRequest>)
    } catch (err) {
      error.value = err as ApiRequestError | null
    } finally {
      pending.value = false
    }
  }

  await fetchData()

  return { data, error, pending, refresh: fetchData }
}
