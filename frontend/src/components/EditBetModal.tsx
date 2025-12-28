import { useEffect, useState } from 'react'
import type { BetStatus, BetSummary } from '../types/api'
import Modal from './Modal'

type Props = {
  isOpen: boolean
  bet: BetSummary | null
  onClose: () => void
  onSubmit: (betId: string, payload: { name?: string; budget?: number; status?: BetStatus; description?: string }) => Promise<void>
}

const statusOptions: BetStatus[] = ['ACTIVE', 'DORMANT', 'ZOMBIE', 'WON', 'LOST']

export default function EditBetModal({ isOpen, bet, onClose, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')
  const [status, setStatus] = useState<BetStatus>('ACTIVE')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!bet) return
    setName(bet.name ?? '')
    setBudget(String(bet.budget ?? ''))
    setStatus(bet.status)
    setDescription(bet.description ?? '')
  }, [bet])

  if (!bet) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    const parsedBudget = budget.trim() ? Number(budget.replace(/[^0-9.]/g, '')) : undefined
    if (!name.trim()) {
      setError('Provide a name to continue.')
      return
    }
    if (parsedBudget !== undefined && parsedBudget <= 0) {
      setError('Budget must be greater than 0.')
      return
    }

    setSaving(true)
    try {
      await onSubmit(bet.id, {
        name: name.trim(),
        budget: parsedBudget,
        status,
        description: description.trim() || undefined
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update bet')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Edit Bet"
      description="Update name, budget, or status."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="ghost-button flex-1" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="edit-bet-form" className="neon-button flex-1" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </>
      }
    >
      <form id="edit-bet-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-text-tertiary">Bet Name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input-field mt-2"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-text-tertiary">Budget</label>
          <input
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className="input-field mt-2"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-text-tertiary">Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as BetStatus)}
            className="input-field mt-2"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-text-tertiary">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="input-field mt-2 min-h-[90px]"
          />
        </div>
        {error ? <p className="text-sm text-burn-start">{error}</p> : null}
      </form>
    </Modal>
  )
}
