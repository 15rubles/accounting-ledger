import type { ApiErrorBody } from '../types'

export class ApiRequestError extends Error {
  status: number
  body: ApiErrorBody

  constructor(status: number, body: ApiErrorBody) {
    super(body.detail ?? `Request failed with status ${status}`)
    this.status = status
    this.body = body
  }
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiRequestError(res.status, body)
  }

  return res.json()
}