import { useMemo, useState } from 'react'
import type { BetSummary } from '../types/api'
import Modal from './Modal'

type Props = {
  isOpen: boolean
  onClose: () => void
  bets: BetSummary[]
  onSubmit: (payload: {
    bet_id: string
    amount: number
    type: 'revenue' | 'expense'
    description: string
    source?: string
  }) => Promise<void>
}

export default function AddTransactionModal({ isOpen, onClose, bets, onSubmit }: Props) {
  const [type, setType] = useState<'revenue' | 'expense'>('revenue')
  const [amount, setAmount] = useState('')
  const [betId, setBetId] = useState('')
  const [description, setDescription] = useState('')
  const [source, setSource] = useState('Manual')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const betOptions = useMemo(() => bets.slice().sort((a, b) => a.name.localeCompare(b.name)), [bets])
  const hasBets = betOptions.length > 0

  const handleSave = async () => {
    setError('')
    const parsedAmount = Number(amount.replace(/[^0-9.]/g, ''))
    if (!betId || !parsedAmount || !description.trim()) {
      setError('Select a bet, amount, and description to continue.')
      return
    }

    setSaving(true)
    try {
      await onSubmit({
        bet_id: betId,
        amount: parsedAmount,
        type,
        description: description.trim(),
        source: source.trim() || undefined
      })
      setAmount('')
      setDescription('')
      setBetId('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save transaction')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Add Transaction"
      description="Tag every expense or revenue entry to a bet."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="ghost-button flex-1" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="neon-button flex-1"
            onClick={handleSave}
            disabled={saving || !hasBets}
          >
            {saving ? 'Saving...' : 'Save Entry'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            className={`flex-1 rounded-md border px-3 py-2 text-sm ${
              type === 'revenue'
                ? 'border-profit-start text-profit-start'
                : 'border-border-subtle text-text-secondary'
            }`}
            onClick={() => setType('revenue')}
          >
            Revenue
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md border px-3 py-2 text-sm ${
              type === 'expense'
                ? 'border-burn-start text-burn-start'
                : 'border-border-subtle text-text-secondary'
            }`}
            onClick={() => setType('expense')}
          >
            Expense
          </button>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
            Amount
          </label>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="input-field mt-2"
            placeholder="$25,000"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
            Bet Tag
          </label>
          <select
            value={betId}
            onChange={(event) => setBetId(event.target.value)}
            className="input-field mt-2"
            disabled={!hasBets}
          >
            <option value="">{hasBets ? 'Select a bet' : 'No bets available'}</option>
            {betOptions.map((bet) => (
              <option key={bet.id} value={bet.id}>
                {bet.name}
              </option>
            ))}
          </select>
          {!hasBets ? (
            <p className="mt-2 text-xs text-text-tertiary">Create a bet first to tag transactions.</p>
          ) : null}
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
            Description
          </label>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="input-field mt-2"
            placeholder="Q3 Enterprise Contract"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
            Source
          </label>
          <input
            value={source}
            onChange={(event) => setSource(event.target.value)}
            className="input-field mt-2"
            placeholder="Manual"
          />
        </div>
        {error ? <p className="text-sm text-burn-start">{error}</p> : null}
      </div>
    </Modal>
  )
}
