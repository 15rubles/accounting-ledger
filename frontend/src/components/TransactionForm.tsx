import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTransaction } from '../api/transactions'
import { ApiRequestError } from '../api/client'
import type { TransactionType } from '../types'

interface Props {
  type: TransactionType
  onDone?: () => void
  onCancel?: () => void
}

export default function TransactionForm({ type, onDone, onCancel }: Props) {
  const [description, setDescription] = useState('')
  const [vendor, setVendor] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries()
      onDone?.()
    },
  })

  const errors: Record<string, string> =
    mutation.error instanceof ApiRequestError ? mutation.error.body.errors ?? {} : {}

  const knownFields = ['description', 'vendor', 'amount', 'date', 'time']
  const otherErrors = Object.entries(errors).filter(([key]) => !knownFields.includes(key))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const value = Number(amount)
    mutation.mutate({
      description,
      vendor,
      amount: type === 'PAYMENT' ? -value : value,
      date: date || undefined,
      time: time ? (time.length === 5 ? `${time}:00` : time) : undefined,
    })
  }

  const isDeposit = type === 'DEPOSIT'

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>{isDeposit ? 'Add Deposit' : 'Make Payment'}</h2>

      <label>
        Description
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
        {errors.description && <span className="error">{errors.description}</span>}
      </label>

      <label>
        Vendor
        <input value={vendor} onChange={(e) => setVendor(e.target.value)} />
        {errors.vendor && <span className="error">{errors.vendor}</span>}
      </label>

      <label>
        Amount
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {errors.amount && <span className="error">{errors.amount}</span>}
      </label>

      <div className="row">
        <label>
          Date (optional)
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          {errors.date && <span className="error">{errors.date}</span>}
        </label>
        <label>
          Time (optional)
          <input type="time" step="1" value={time} onChange={(e) => setTime(e.target.value)} />
          {errors.time && <span className="error">{errors.time}</span>}
        </label>
      </div>

      {otherErrors.map(([key, message]) => (
        <p key={key} className="error">{message}</p>
      ))}
      {mutation.error && !(mutation.error instanceof ApiRequestError && mutation.error.body.errors) && (
        <p className="error">{mutation.error.message}</p>
      )}

      <div className="row">
        <button type="submit" className="primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : isDeposit ? 'Add Deposit' : 'Make Payment'}
        </button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}