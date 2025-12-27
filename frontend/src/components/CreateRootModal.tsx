import { useState } from 'react'
import Modal from './Modal'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, budget: number) => Promise<void>
}

export default function CreateRootModal({ isOpen, onClose, onSubmit }: Props) {
  const [name, setName] = useState('Company Growth 2025')
  const [budget, setBudget] = useState('1000000')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    const parsed = Number(budget.replace(/[^0-9.]/g, ''))
    if (!name.trim() || parsed <= 0) {
      setError('Provide a name and budget to continue.')
      return
    }

    setSaving(true)
    try {
      await onSubmit(name.trim(), parsed)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create bet')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Create Root Bet"
      description="Start your strategy tree by naming the root bet and setting a budget."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="ghost-button flex-1" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="root-bet-form" className="neon-button flex-1">
            {saving ? 'Creating...' : 'Initialize'}
          </button>
        </>
      }
    >
      <form id="root-bet-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
            Bet Name
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input-field mt-2"
            placeholder="Company Growth 2025"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
            Budget
          </label>
          <input
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className="input-field mt-2"
            placeholder="1000000"
          />
        </div>
        {error ? <p className="text-sm text-burn-start">{error}</p> : null}
      </form>
    </Modal>
  )
}
