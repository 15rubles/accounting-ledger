import { formatMoney } from '../utils/format'

interface Props {
  totalDeposits: number
  totalPayments: number
  net: number
}

export default function SummaryCards({ totalDeposits, totalPayments, net }: Props) {
  return (
    <div className="cards">
      <div className="card">
        <span className="muted">Deposits</span>
        <strong className="positive">{formatMoney(totalDeposits)}</strong>
      </div>
      <div className="card">
        <span className="muted">Payments</span>
        <strong className="negative">{formatMoney(totalPayments)}</strong>
      </div>
      <div className="card">
        <span className="muted">Net</span>
        <strong className={net >= 0 ? 'positive' : 'negative'}>{formatMoney(net)}</strong>
      </div>
    </div>
  )
}