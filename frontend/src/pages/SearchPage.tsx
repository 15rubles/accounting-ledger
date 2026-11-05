import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchTransactions } from '../api/transactions'
import TransactionTable from '../components/TransactionTable'
import type { SearchCriteria } from '../types'

const EMPTY: SearchCriteria = {
  startDate: '',
  endDate: '',
  description: '',
  vendor: '',
  minAmount: '',
  maxAmount: '',
}

export default function SearchPage() {
  const [form, setForm] = useState<SearchCriteria>(EMPTY)
  const [submitted, setSubmitted] = useState<SearchCriteria | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', submitted],
    queryFn: () => searchTransactions(submitted!),
    enabled: submitted !== null,
  })

  const update = (field: keyof SearchCriteria) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted({ ...form })
  }

  const handleReset = () => {
    setForm(EMPTY)
    setSubmitted(null)
  }

  return (
    <>
      <h1>Custom Search</h1>

      <form className="card form" onSubmit={handleSubmit}>
        <div className="row">
          <label>Start date<input type="date" value={form.startDate} onChange={update('startDate')} /></label>
          <label>End date<input type="date" value={form.endDate} onChange={update('endDate')} /></label>
        </div>
        <div className="row">
          <label>Description<input value={form.description} onChange={update('description')} /></label>
          <label>Vendor<input value={form.vendor} onChange={update('vendor')} /></label>
        </div>
        <div className="row">
          <label>Min amount<input type="number" step="0.01" value={form.minAmount} onChange={update('minAmount')} /></label>
          <label>Max amount<input type="number" step="0.01" value={form.maxAmount} onChange={update('maxAmount')} /></label>
        </div>
        <div className="row">
          <button type="submit" className="primary">Search</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {isLoading && <p className="muted">Searching...</p>}
      {error && <p className="error">{error.message}</p>}
      {data && <TransactionTable transactions={data} />}
    </>
  )
}