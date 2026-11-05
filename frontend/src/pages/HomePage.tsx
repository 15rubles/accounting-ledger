import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getTransactions } from '../api/transactions'
import TransactionForm from '../components/TransactionForm'
import TransactionTable from '../components/TransactionTable'
import type { TransactionType } from '../types'
import { formatMoney, sumMoney } from '../utils/format'

export default function HomePage() {
  const [formType, setFormType] = useState<TransactionType | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions', undefined],
    queryFn: () => getTransactions(),
  })

  const balance = data ? sumMoney(data.map((t) => t.amount)) : 0

  return (
    <>
      <section className="hero">
        <h1>Welcome back</h1>
        <div className="card balance">
          <span className="muted">Current balance</span>
          <strong className={balance >= 0 ? 'positive' : 'negative'}>
            {isLoading ? '...' : formatMoney(balance)}
          </strong>
        </div>
      </section>

      {formType && (
        <TransactionForm
          key={formType}
          type={formType}
          onDone={() => setFormType(null)}
          onCancel={() => setFormType(null)}
        />
      )}

      <h2>Recent transactions</h2>
      {error && <p className="error">{error.message}</p>}
      {data && <TransactionTable transactions={data.slice(0, 5)} />}
      <Link to="/ledger">View full ledger →</Link>
    </>
  )
}