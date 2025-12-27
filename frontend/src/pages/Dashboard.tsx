import { useEffect, useMemo, useState } from 'react'
import AddTransactionModal from '../components/AddTransactionModal'
import BetDetailDrawer from '../components/BetDetailDrawer'
import CreateRootModal from '../components/CreateRootModal'
import EditBetModal from '../components/EditBetModal'
import StrategyTree from '../components/StrategyTree'
import ZeroState from '../components/ZeroState'
import {
  createBet,
  createTransaction,
  deleteBet,
  fetchBetTree,
  fetchSummary,
  fetchTransactions,
  updateBet
} from '../api/client'
import type { BetSummary, BetTreeNode, SummaryMetrics, Transaction } from '../types/api'
import { formatCurrency } from '../utils/format'

const flattenBets = (nodes: BetTreeNode[]): BetTreeNode[] =>
  nodes.flatMap((node) => [node, ...flattenBets(node.children)])

const findBet = (nodes: BetTreeNode[], id: string): BetTreeNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node
    const child = findBet(node.children, id)
    if (child) return child
  }
  return null
}

export default function Dashboard() {
  const [tree, setTree] = useState<BetTreeNode[]>([])
  const [summary, setSummary] = useState<SummaryMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showRootModal, setShowRootModal] = useState(false)
  const [showTxnModal, setShowTxnModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBet, setSelectedBet] = useState<BetSummary | null>(null)
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([])

  const betList = useMemo(() => flattenBets(tree), [tree])

  const loadDashboard = async () => {
    setLoading(true)
    setError('')
    try {
      const [summaryResult, treeResult] = await Promise.allSettled([fetchSummary(), fetchBetTree()])
      if (summaryResult.status === 'fulfilled') {
        setSummary(summaryResult.value)
      }
      if (treeResult.status === 'fulfilled') {
        setTree(treeResult.value)
        if (selectedBet) {
          setSelectedBet(findBet(treeResult.value, selectedBet.id))
        }
      }
      if (summaryResult.status === 'rejected' || treeResult.status === 'rejected') {
        const summaryError =
          summaryResult.status === 'rejected' ? summaryResult.reason?.message : null
        const treeError = treeResult.status === 'rejected' ? treeResult.reason?.message : null
        setError(summaryError ?? treeError ?? 'Unable to load dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const handleInitialize = async (name: string, budget: number) => {
    await createBet({ name, budget, parent_id: null })
    await loadDashboard()
  }

  const handleSelectBet = async (bet: BetTreeNode) => {
    setSelectedBet(bet)
    try {
      const transactions = await fetchTransactions(bet.id)
      setSelectedTransactions(transactions)
    } catch {
      setSelectedTransactions([])
    }
  }

  const handleAddTransaction = async (payload: {
    bet_id: string
    amount: number
    type: 'revenue' | 'expense'
    description: string
    source?: string
  }) => {
    await createTransaction(payload)
    await loadDashboard()
    if (selectedBet?.id === payload.bet_id) {
      const transactions = await fetchTransactions(payload.bet_id)
      setSelectedTransactions(transactions)
    }
  }

  const handleEditBet = async (
    betId: string,
    payload: { name?: string; budget?: number; status?: BetSummary['status']; description?: string }
  ) => {
    await updateBet(betId, payload)
    await loadDashboard()
  }

  const handleDeleteBet = async (betId: string) => {
    const confirmed = window.confirm('Mark this bet as lost? This will remove it from active views.')
    if (!confirmed) return
    await deleteBet(betId)
    setSelectedBet(null)
    setShowEditModal(false)
    await loadDashboard()
  }

  const handleToggleFlag = async (bet: BetSummary) => {
    await updateBet(bet.id, { flagged: !bet.flagged })
    await loadDashboard()
  }

  const initialized = tree.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Dashboard</p>
          <h2 className="text-2xl font-semibold">Strategy Tree</h2>
          <p className="text-sm text-text-secondary">
            Monitor burn versus return across your strategic bets.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="ghost-button">
            Export Snapshot
          </button>
          <button type="button" className="neon-button" onClick={() => setShowRootModal(true)}>
            + Initialize Strategy
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-burn-start">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-4">
        <div className="kpi">
          <span className="kpi-label">Total Burn</span>
          <span className="kpi-value text-burn-start text-glow-burn">
            {summary ? formatCurrency(summary.total_burn) : '--'}
          </span>
        </div>
        <div className="kpi">
          <span className="kpi-label">Runway</span>
          <span className="kpi-value">
            {summary?.runway_months !== null && summary?.runway_months !== undefined
              ? `${summary.runway_months.toFixed(1)} mo`
              : 'N/A'}
          </span>
        </div>
        <div className="kpi">
          <span className="kpi-label">Active Bets</span>
          <span className="kpi-value">{summary ? summary.active_bets : '--'}</span>
        </div>
        <div className="kpi">
          <span className="kpi-label">Total Yield</span>
          <span className="kpi-value text-profit-start text-glow">
            {summary ? formatCurrency(summary.total_revenue) : '--'}
          </span>
        </div>
      </section>

      <section className="surface-card px-4 py-4">
        {loading ? (
          <p className="text-sm text-text-secondary">Loading strategy tree...</p>
        ) : !initialized ? (
          <ZeroState onInitialize={() => setShowRootModal(true)} />
        ) : (
          <StrategyTree tree={tree} onSelectBet={handleSelectBet} />
        )}
      </section>

      <section className="surface-card px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Zombie Alert</p>
            <p className="text-sm text-text-secondary">
              Monitor inactive bets and reclaim frozen budgets.
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="ghost-button">
              Review
            </button>
            <button type="button" className="neon-button">
              Resolve
            </button>
          </div>
        </div>
      </section>

      <button
        type="button"
        className="fixed bottom-6 right-24 flex h-12 w-12 items-center justify-center rounded-full bg-profit-flow text-lg font-semibold text-void shadow-glow"
        onClick={() => setShowTxnModal(true)}
        aria-label="Quick add transaction"
      >
        +
      </button>

      <CreateRootModal
        isOpen={showRootModal}
        onClose={() => setShowRootModal(false)}
        onSubmit={handleInitialize}
      />

      <AddTransactionModal
        isOpen={showTxnModal}
        onClose={() => setShowTxnModal(false)}
        bets={betList}
        onSubmit={handleAddTransaction}
      />

      <BetDetailDrawer
        bet={selectedBet}
        transactions={selectedTransactions}
        onClose={() => setSelectedBet(null)}
        onEdit={() => setShowEditModal(true)}
        onDelete={handleDeleteBet}
        onToggleFlag={handleToggleFlag}
      />

      <EditBetModal
        isOpen={showEditModal}
        bet={selectedBet}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditBet}
      />
    </div>
  )
}
