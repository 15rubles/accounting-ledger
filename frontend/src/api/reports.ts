import { api } from './client'
import type { ReportResponse } from '../types'

export type ReportPeriod = 'month-to-date' | 'previous-month' | 'year-to-date' | 'previous-year'

export const getPeriodReport = (period: ReportPeriod) =>
  api<ReportResponse>(`/reports/${period}`)

export const getVendorReport = (vendor: string) =>
  api<ReportResponse>(`/reports/vendor?vendor=${encodeURIComponent(vendor)}`)