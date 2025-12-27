import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/ledger', label: 'Ledger' },
  { to: '/settings', label: 'Settings' }
]

export default function Sidebar() {
  return (
    <aside className="hidden w-60 flex-col border-r border-border-subtle bg-surface-100 px-4 py-6 md:flex">
      <div className="flex items-center gap-3 px-2">
        <div className="h-9 w-9 rounded-full bg-ai-flow shadow-glow-ai" />
        <div>
          <p className="text-sm font-semibold">BetMetric</p>
          <p className="text-xs text-text-tertiary">Control Tower</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
          >
            <span className="h-2 w-2 rounded-full bg-profit-flow shadow-glow" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="surface-card mt-auto px-3 py-3 text-xs text-text-secondary">
        Data status: Live sync disabled
      </div>
    </aside>
  )
}
