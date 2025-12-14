import type { User } from '~/types/user'
import type { LoginResponse, LoginPayload } from '~/types/auth'

export const useAuth = () => {
  const user = useState<User | null>('auth:user', () => null)
  const token = useState<string | null>('auth:token', () => null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (payload: LoginPayload) => {
    const { data } = await $fetch<LoginResponse>('/api/login', {
      method: 'POST',
      body: payload
    })

    user.value = data.user
    token.value = data.token
  }

  const logout = async () => {
    await $fetch('/api/logout', {
      method: 'POST'
    })

    user.value = null
    token.value = null
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }
}
