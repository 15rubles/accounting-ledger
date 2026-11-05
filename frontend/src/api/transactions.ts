import { api } from './client'
import type { SearchCriteria, Transaction, TransactionRequest, TransactionType } from '../types'

export const getTransactions = (type?: TransactionType) =>
  api<Transaction[]>(type ? `/transactions?type=${type}` : '/transactions')

export const createTransaction = (body: TransactionRequest) =>
  api<Transaction>('/transactions', {
    method: 'POST',
    body: JSON.stringify(body),
  })

export const searchTransactions = (criteria: SearchCriteria) => {
  const params = new URLSearchParams()
  Object.entries(criteria).forEach(([key, value]) => {
    if (value !== undefined && value.trim() !== '') params.append(key, value.trim())
  })
  return api<Transaction[]>(`/transactions/search?${params}`)
}