import { useEffect, useMemo, useState } from 'react'
import AddTransactionModal from '../components/AddTransactionModal'
import { createTransaction, fetchBetTree, fetchTransactions } from '../api/client'
import type { BetTreeNode, Transaction } from '../types/api'
import { formatDelta } from '../utils/format'

const flattenBets = (nodes: BetTreeNode[]): BetTreeNode[] =>
  nodes.flatMap((node) => [node, ...flattenBets(node.children)])

export default function Ledger() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [tree, setTree] = useState<BetTreeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  const betList = useMemo(() => flattenBets(tree), [tree])
  const betNameById = useMemo(() => {
    const map = new Map<string, string>()
    betList.forEach((bet) => map.set(bet.id, bet.name))
    return map
  }, [betList])

  const loadLedger = async () => {
    setLoading(true)
    setError('')
    try {
      const [txs, treeData] = await Promise.all([fetchTransactions(), fetchBetTree()])
      setTransactions(txs)
      setTree(treeData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load ledger')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLedger()
  }, [])

  const handleAddTransaction = async (payload: {
    bet_id: string
    amount: number
    type: 'revenue' | 'expense'
    description: string
    source?: string
  }) => {
    await createTransaction(payload)
    await loadLedger()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Ledger</p>
          <h2 className="text-2xl font-semibold">Truth Ledger</h2>
          <p className="text-sm text-text-secondary">
            Every transaction tagged to a bet. No exceptions.
          </p>
        </div>
        <button type="button" className="neon-button" onClick={() => setShowModal(true)}>
          + Add Transaction
        </button>
      </div>

      {error ? <p className="text-sm text-burn-start">{error}</p> : null}

      <div className="surface-card overflow-hidden">
        <div className="grid grid-cols-5 gap-4 border-b border-border-subtle px-6 py-3 text-left text-xs uppercase tracking-[0.2em] text-text-tertiary">
          <span>Date</span>
          <span>Amount</span>
          <span>Description</span>
          <span>Bet Tag</span>
          <span>Type</span>
        </div>
        <div className="divide-y divide-border-subtle">
          {loading ? (
            <div className="px-6 py-6 text-sm text-text-secondary">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="px-6 py-6 text-sm text-text-secondary">No transactions yet.</div>
          ) : (
            transactions.map((row) => {
              const betName = row.bet_name ?? betNameById.get(row.bet_id) ?? 'Unknown bet'
              return (
                <div key={row.id} className="grid grid-cols-5 gap-4 px-6 py-4 text-sm">
                  <span className="text-text-secondary">{row.date}</span>
                  <span className={row.type.toLowerCase() === 'revenue' ? 'text-profit-start' : 'text-burn-start'}>
                    {formatDelta(
                      row.type.toLowerCase() === 'revenue' ? Number(row.amount) : -Number(row.amount)
                    )}
                  </span>
                  <span>{row.description}</span>
                  <span className="text-text-secondary">{betName}</span>
                  <span className="text-text-secondary">
                    {row.type.toLowerCase() === 'revenue' ? 'Revenue' : 'Expense'}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>

      <AddTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        bets={betList}
        onSubmit={handleAddTransaction}
      />
    </div>
  )
}
