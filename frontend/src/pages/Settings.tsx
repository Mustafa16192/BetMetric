const team = [
  {
    name: 'Elena Park',
    role: 'CEO',
    access: 'Owner'
  },
  {
    name: 'Noah Kim',
    role: 'Growth Lead',
    access: 'Editor'
  },
  {
    name: 'Lia Torres',
    role: 'Product Lead',
    access: 'Editor'
  },
  {
    name: 'Mara Chen',
    role: 'Finance',
    access: 'Viewer'
  }
]

export default function Settings() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Settings</p>
        <h2 className="text-2xl font-semibold">Team Management</h2>
        <p className="text-sm text-text-secondary">
          Control who can log transactions and interrogate the ledger.
        </p>
      </div>

      <div className="surface-card divide-y divide-border-subtle">
        {team.map((member) => (
          <div key={member.name} className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-semibold">{member.name}</p>
              <p className="text-xs text-text-tertiary">{member.role}</p>
            </div>
            <span className="badge">{member.access}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
