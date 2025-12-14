interface LoadingState {
  app: boolean
  page: boolean
  http: number
}

export const useLoading = () => {
  const loading = useState<LoadingState>('loading', () => ({
    app: true,
    page: false,
    http: 0
  }))

  const setAppLoading = (value: boolean) => {
    loading.value.app = value
  }

  const setPageLoading = (value: boolean) => {
    loading.value.page = value
  }

  // Track concurrent HTTP requests using a counter
  const isHttpLoading = computed(() => loading.value.http > 0)
  const incrementPendingRequests = () => {
    loading.value.http += 1
  }
  const decrementPendingRequests = () => {
    if (loading.value.http > 0) {
      loading.value.http -= 1
    }
  }
  const resetPendingRequests = () => {
    loading.value.http = 0
  }

  return {
    loading,
    appLoading: computed(() => loading.value.app),
    pageLoading: computed(() => loading.value.page),
    pendingRequestCount: computed(() => loading.value.http),
    isHttpLoading,
    setAppLoading,
    setPageLoading,
    incrementPendingRequests,
    decrementPendingRequests,
    resetPendingRequests
  }
}
