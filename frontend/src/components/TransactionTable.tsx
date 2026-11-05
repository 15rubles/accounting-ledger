import type { Transaction } from '../types'
import { formatMoney } from '../utils/format'

export default function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <p className="muted">No transactions found.</p>
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Description</th>
            <th>Vendor</th>
            <th className="right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.time}</td>
              <td>{t.description}</td>
              <td>{t.vendor}</td>
              <td className={`right ${t.amount > 0 ? 'positive' : 'negative'}`}>
                {formatMoney(t.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}