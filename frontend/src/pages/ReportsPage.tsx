import { useState } from 'react'
import type { FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPeriodReport, getVendorReport } from '../api/reports'
import type { ReportPeriod } from '../api/reports'
import SummaryCards from '../components/SummaryCards.tsx'
import TransactionTable from '../components/TransactionTable'

type Selection =
  | { kind: 'period'; period: ReportPeriod }
  | { kind: 'vendor'; vendor: string }

const PERIODS: { label: string; value: ReportPeriod }[] = [
  { label: 'Month to Date', value: 'month-to-date' },
  { label: 'Previous Month', value: 'previous-month' },
  { label: 'Year to Date', value: 'year-to-date' },
  { label: 'Previous Year', value: 'previous-year' },
]

export default function ReportsPage() {
  const [selection, setSelection] = useState<Selection>({ kind: 'period', period: 'month-to-date' })
  const [vendorInput, setVendorInput] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['report', selection],
    queryFn: () =>
      selection.kind === 'period'
        ? getPeriodReport(selection.period)
        : getVendorReport(selection.vendor),
  })

  const handleVendorSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (vendorInput.trim()) setSelection({ kind: 'vendor', vendor: vendorInput.trim() })
  }

  return (
    <>
      <h1>Reports</h1>

      <div className="tabs">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            className={selection.kind === 'period' && selection.period === p.value ? 'active' : ''}
            onClick={() => setSelection({ kind: 'period', period: p.value })}
          >
            {p.label}
          </button>
        ))}
      </div>

      <form className="row" onSubmit={handleVendorSubmit}>
        <input
          placeholder="Search by vendor"
          value={vendorInput}
          onChange={(e) => setVendorInput(e.target.value)}
        />
        <button type="submit">Vendor report</button>
      </form>

      {isLoading && <p className="muted">Loading...</p>}
      {error && <p className="error">{error.message}</p>}
      {data && (
        <>
          <h2>{data.title}</h2>
          {data.from && data.to && (
            <p className="muted">{data.from} to {data.to}</p>
          )}
          <SummaryCards
            totalDeposits={data.totalDeposits}
            totalPayments={data.totalPayments}
            net={data.net}
          />
          <TransactionTable transactions={data.transactions} />
        </>
      )}
    </>
  )
}