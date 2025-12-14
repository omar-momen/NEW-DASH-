import type { FetchOptions, ResolvedFetchOptions, ResponseType } from 'ofetch'
import type { UseFetchOptions } from 'nuxt/app'
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

/**
 * Base type for custom API options
 */
export type ApiCustomOptions = {
  /**
   * If true, suppresses error toast notifications
   */
  silent?: boolean
  /**
   * If true, skips adding default headers (Authorization, Accept-Language, etc.)
   */
  noHeaders?: boolean
}

/**
 * Centralized API options type for useApi composable
 * Extends UseFetchOptions and adds custom options
 */
export type ExtendedFetchOptions<T = unknown> = UseFetchOptions<T> & ApiCustomOptions

/**
 * Centralized API options type for useClientApi composable
 * Extends FetchOptions and adds custom options
 */
export type ExtendedNitroFetchOptions<T = unknown> = FetchOptions & ApiCustomOptions

/**
 * Internal type for resolved fetch options (used in plugins)
 */
export type ExtendedResolvedFetchOptions<
  R extends ResponseType = ResponseType,
  T = unknown
> = ResolvedFetchOptions<R, T> & ApiCustomOptions

export interface ErrorDetails {
  message: string
  statusCode?: number
  statusMessage?: string
  stack?: string
  data?: unknown
  url?: string
}

export interface ApiRequestError {
  statusCode: number
  statusMessage: string
  message: string
  data?: unknown
  url?: string
}
