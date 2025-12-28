import type { BetSummary, BetTreeNode, SummaryMetrics, Transaction } from '../types/api'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
console.log('API Client Configured URL:', API_BASE)
const API_PREFIX = `${API_BASE.replace(/\/$/, '')}/v1`

type RequestOptions = RequestInit & { json?: unknown }

const request = async <T>(path: string, options: RequestOptions = {}) => {
  const headers = new Headers(options.headers)
  if (options.json !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_PREFIX}${path}`, {
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message = errorBody.detail || errorBody.message || response.statusText
    throw new Error(message)
  }

  if (response.status === 204) {
    return null as T
  }

  return (await response.json()) as T
}

export const fetchSummary = () => request<SummaryMetrics>('/metrics/summary')

export const fetchBetTree = () => request<BetTreeNode[]>('/bets/tree')

export const fetchBetSummary = (betId: string) => request<BetSummary>(`/bets/${betId}`)

export const createBet = (payload: {
  name: string
  budget: number
  description?: string
  parent_id?: string | null
}) => request<BetSummary>('/bets', { method: 'POST', json: payload })

export const updateBet = (
  betId: string,
  payload: { name?: string; budget?: number; status?: BetSummary['status']; description?: string; flagged?: boolean }
) => request<BetSummary>(`/bets/${betId}`, { method: 'PATCH', json: payload })

export const deleteBet = (betId: string) => request<{ message: string }>(`/bets/${betId}`, { method: 'DELETE' })

export const fetchTransactions = (betId?: string) => {
  const query = betId ? `?bet_id=${encodeURIComponent(betId)}` : ''
  return request<Transaction[]>(`/transactions${query}`)
}

export const createTransaction = (payload: {
  bet_id: string
  amount: number
  type: 'revenue' | 'expense'
  description: string
  source?: string
  date?: string
}) => request<Transaction>('/transactions', { method: 'POST', json: payload })
