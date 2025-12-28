export type BetStatus = 'ACTIVE' | 'DORMANT' | 'ZOMBIE' | 'WON' | 'LOST'
export type BetHealth = 'profit' | 'burn' | 'warning' | 'zombie'

export type BetSummary = {
  id: string
  name: string
  description?: string | null
  budget: string
  status: BetStatus
  flagged: boolean
  parent_id?: string | null
  created_at?: string | null
  updated_at?: string | null
  direct_revenue: string
  direct_expenses: string
  total_revenue: string
  total_expenses: string
  net_profit: string
  roi: number
  health: BetHealth
  last_transaction_at?: string | null
  inactive_days?: number | null
}

export type BetTreeNode = BetSummary & {
  children: BetTreeNode[]
}

export type Transaction = {
  id: string
  bet_id: string
  bet_name: string
  amount: string
  type: 'REVENUE' | 'EXPENSE'
  description: string
  source?: string | null
  date: string
  created_at?: string | null
  updated_at?: string | null
}

export type SummaryMetrics = {
  total_burn: string
  total_revenue: string
  active_bets: number
  runway_months: number | null
  last_refreshed_at: string
}
