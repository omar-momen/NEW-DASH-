import type { User } from './user'

// ===== Login =====
export interface LoginPayload {
  email: string
  password: string
}
export interface LoginResponse {
  data: {
    user: User
    token: string
  }
}
