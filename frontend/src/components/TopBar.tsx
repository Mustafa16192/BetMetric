import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Strategy Overview',
    subtitle: 'Real-time health of strategic bets'
  },
  '/ledger': {
    title: 'Truth Ledger',
    subtitle: 'Every transaction tagged to a bet'
  },
  '/settings': {
    title: 'Team Settings',
    subtitle: 'Roles, access, and alert routing'
  }
}

export default function TopBar() {
  const location = useLocation()
  const page = pageTitles[location.pathname] ?? {
    title: 'BetMetric',
    subtitle: 'Financial Control Tower'
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle bg-surface-100 px-6 py-4 md:px-10">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">
          {page.subtitle}
        </p>
        <h1 className="text-lg font-semibold md:text-xl">{page.title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="surface-card flex items-center gap-2 px-3 py-2 text-xs text-text-secondary">
          <span className="h-2 w-2 rounded-full bg-profit-start" />
          Sync: Standby
        </div>
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-surface-200">
          <span className="text-sm">!</span>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-burn-start" />
        </div>
        <div className="surface-card flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-surface-200" />
          <div>
            <p className="text-xs font-semibold">CEO Console</p>
            <p className="text-[11px] text-text-tertiary">betmetric.io</p>
          </div>
        </div>
      </div>
    </header>
  )
}
