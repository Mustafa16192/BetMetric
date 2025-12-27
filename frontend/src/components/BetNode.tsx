import type { NodeProps } from 'reactflow'
import type { BetHealth } from '../types/api'
import { formatCurrency } from '../utils/format'

type BetNodeData = {
  title: string
  budget: number
  spend: number
  revenue: number
  status: BetHealth
  flagged?: boolean
  inactiveDays?: number
}

const statusStyles: Record<BetHealth, string> = {
  profit: 'from-profit-start/70 to-profit-end/70',
  burn: 'from-burn-start/70 to-burn-end/70',
  warning: 'from-burn-end/60 to-burn-start/60',
  zombie: 'from-zombie-start/70 to-zombie-end/70'
}

const statusLabels: Record<BetHealth, string> = {
  profit: 'Profitable',
  burn: 'Critical',
  warning: 'Warning',
  zombie: 'Zombie'
}

export default function BetNode({ data }: NodeProps<BetNodeData>) {
  const badgeClass =
    data.status === 'burn'
      ? 'badge badge--burn'
      : data.status === 'zombie'
        ? 'badge badge--zombie'
        : 'badge badge--profit'

  return (
    <div
      className={`rounded-lg bg-gradient-to-r p-[1px] ${statusStyles[data.status]} ${
        data.status === 'zombie' ? 'opacity-60 animate-pulse-zombie' : ''
      }`}
    >
      <div className="rounded-lg bg-surface-100 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-text-primary">{data.title}</h3>
          <div className="flex items-center gap-2">
            {data.flagged ? <span className="badge badge--flag">FLAG</span> : null}
            <span className={badgeClass}>{statusLabels[data.status]}</span>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-text-tertiary">
          <span>Budget</span>
          <span>Spend</span>
          <span>Revenue</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-text-primary">
          <span>{formatCurrency(data.budget)}</span>
          <span className={data.status === 'burn' ? 'text-burn-start' : ''}>
            {formatCurrency(data.spend)}
          </span>
          <span className={data.status === 'profit' ? 'text-profit-start' : ''}>
            {formatCurrency(data.revenue)}
          </span>
        </div>
        {data.inactiveDays ? (
          <p className="mt-2 text-[11px] text-text-secondary">
            Inactive {data.inactiveDays} days
          </p>
        ) : null}
      </div>
    </div>
  )
}
