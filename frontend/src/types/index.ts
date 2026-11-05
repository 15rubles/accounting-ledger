export type TransactionType = 'DEPOSIT' | 'PAYMENT'

export interface Transaction {
  id: number
  date: string
  time: string
  description: string
  vendor: string
  amount: number
  type: TransactionType
}

export interface TransactionRequest {
  description: string
  vendor: string
  amount: number
  date?: string
  time?: string
}

export interface ReportResponse {
  title: string
  from: string | null
  to: string | null
  totalDeposits: number
  totalPayments: number
  net: number
  transactions: Transaction[]
}

export interface SearchCriteria {
  startDate?: string
  endDate?: string
  description?: string
  vendor?: string
  minAmount?: string
  maxAmount?: string
}

export interface ApiErrorBody {
  detail?: string
  errors?: Record<string, string>
}