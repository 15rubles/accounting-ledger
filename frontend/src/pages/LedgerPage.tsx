import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTransactions } from '../api/transactions'
import TransactionTable from '../components/TransactionTable'
import type { TransactionType } from '../types'
import TransactionForm from '../components/TransactionForm'

const TABS: { label: string; value?: TransactionType }[] = [
  { label: 'All' },
  { label: 'Deposits', value: 'DEPOSIT' },
  { label: 'Payments', value: 'PAYMENT' },
]

export default function LedgerPage() {
  const [type, setType] = useState<TransactionType | undefined>()

  const [formType, setFormType] = useState<TransactionType | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions', type],
    queryFn: () => getTransactions(type),
  })

  return (
    <>
      <h1>Ledger</h1>

      <div className="row">
        <button className="primary" onClick={() => setFormType('DEPOSIT')}>+ Add Deposit</button>
        <button className="primary" onClick={() => setFormType('PAYMENT')}>- Make Payment</button>
      </div>

      {formType && (
        <TransactionForm
            key={formType}
            type={formType}
            onDone={() => setFormType(null)}
            onCancel={() => setFormType(null)}
        />
      )}

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            className={type === tab.value ? 'active' : ''}
            onClick={() => setType(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="muted">Loading...</p>}
      {error && <p className="error">{error.message}</p>}
      {data && <TransactionTable transactions={data} />}
    </>
  )
}