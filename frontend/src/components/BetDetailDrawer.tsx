import type { BetSummary, Transaction } from '../types/api'
import { formatCurrency, formatDelta } from '../utils/format'

type Props = {
  bet: BetSummary | null
  transactions: Transaction[]
  onClose: () => void
  onEdit: () => void
  onDelete: (betId: string) => void
  onToggleFlag: (bet: BetSummary) => void
}

const statusBadge: Record<string, string> = {
  profit: 'badge badge--profit',
  burn: 'badge badge--burn',
  warning: 'badge badge--burn',
  zombie: 'badge badge--zombie'
}

export default function BetDetailDrawer({ bet, transactions, onClose, onEdit, onDelete, onToggleFlag }: Props) {
  if (!bet) return null

  const lastActivity = bet.last_transaction_at
    ? new Date(bet.last_transaction_at).toLocaleDateString()
    : 'No activity'

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/60 backdrop-blur-sm">
      <button type="button" className="flex-1" onClick={onClose} aria-label="Close" />
      <aside className="h-full w-full max-w-md border-l border-border-subtle bg-surface-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Bet Detail</p>
            <h2 className="text-xl font-semibold">{bet.name}</h2>
            <p className="text-sm text-text-secondary">Last activity: {lastActivity}</p>
          </div>
          <div className="flex items-center gap-2">
            {bet.flagged ? <span className="badge badge--flag">FLAGGED</span> : null}
            <span className={statusBadge[bet.health]}>{bet.health.toUpperCase()}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="surface-card px-4 py-3">
            <p className="text-xs text-text-tertiary">Mini P and L</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-text-tertiary">Revenue</p>
                <p className="text-lg font-semibold text-profit-start">
                  {formatCurrency(bet.total_revenue)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Spend</p>
                <p className="text-lg font-semibold text-burn-start">
                  {formatCurrency(bet.total_expenses)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Budget</p>
                <p className="text-lg font-semibold">{formatCurrency(bet.budget)}</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">ROI</p>
                <p className="text-lg font-semibold">
                  {bet.roi >= 0 ? '+' : ''}{bet.roi.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          <div className="surface-card px-4 py-3">
            <p className="text-xs text-text-tertiary">Recent activity</p>
            <div className="mt-3 space-y-3">
              {transactions.length === 0 ? (
                <p className="text-sm text-text-secondary">No transactions yet.</p>
              ) : (
                transactions.slice(0, 3).map((row) => (
                  <div key={row.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-text-primary">{row.description}</p>
                      <p className="text-xs text-text-tertiary">{row.date}</p>
                    </div>
                    <span
                      className={row.type.toLowerCase() === 'revenue' ? 'text-profit-start' : 'text-burn-start'}
                    >
                      {formatDelta(
                        row.type.toLowerCase() === 'revenue' ? Number(row.amount) : -Number(row.amount)
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="ghost-button flex-1" onClick={onEdit}>
              Edit Bet
            </button>
            <button type="button" className="neon-button flex-1" onClick={() => onToggleFlag(bet)}>
              {bet.flagged ? 'Unflag' : 'Flag for Review'}
            </button>
            <button type="button" className="ghost-button flex-1" onClick={() => onDelete(bet.id)}>
              Delete Bet
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
