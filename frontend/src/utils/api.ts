import axios from 'axios';

// Direct connection to backend (Browser -> Host:8000)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
console.log('Configured API_URL:', API_URL);

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Transaction {
  id: string;
  bet_id: string;
  amount: number;
  type: 'REVENUE' | 'EXPENSE';
  description: string;
  date: string;
}

export interface TransactionCreate {
  bet_id: string;
  amount: number;
  type: 'REVENUE' | 'EXPENSE';
  description: string;
  date?: string;
}

export interface Bet {
  id: string;
  name: string;
  description?: string;
  budget: number;
  status: 'ACTIVE' | 'DORMANT' | 'ZOMBIE' | 'WON' | 'LOST';
  flagged?: boolean;
  parent_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BetCreate {
  name: string;
  description?: string;
  budget: number;
  parent_id?: string | null;
}

export interface BetTreeItem extends Bet {
  children: BetTreeItem[];
  // Assuming these will be part of the BetTreeItem in the future, if returned directly from /tree
  flagged?: boolean; 
  health_status?: 'green' | 'red' | 'yellow'; 
}

export interface SummaryMetrics {
  total_burn: number;
  runway_months: number;
  active_bets: number;
  total_revenue: number;
}

export interface BetUpdate {
  name?: string;
  description?: string;
  budget?: number;
  status?: 'ACTIVE' | 'DORMANT' | 'ZOMBIE' | 'WON' | 'LOST';
  parent_id?: string | null;
}

export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await apiClient.get('/v1/transactions/');
  return response.data;
};

export const createTransaction = async (transaction: TransactionCreate): Promise<Transaction> => {
  const response = await apiClient.post('/v1/transactions/', transaction);
  return response.data;
};

export const fetchBets = async (): Promise<Bet[]> => {
  const response = await apiClient.get('/v1/bets/');
  return response.data;
};

export const createBet = async (bet: BetCreate): Promise<Bet> => {
  const response = await apiClient.post('/v1/bets/', bet);
  return response.data;
};

export const updateBet = async (betId: string, betUpdate: BetUpdate): Promise<Bet> => {
  const response = await apiClient.patch(`/v1/bets/${betId}`, betUpdate);
  return response.data;
};

export const fetchBetTree = async (): Promise<BetTreeItem[]> => {
  const response = await apiClient.get('/v1/bets/tree');
  return response.data;
};

export const fetchSummary = async (): Promise<SummaryMetrics> => {
  // Placeholder for now. Eventually this will hit a dedicated backend endpoint.
  // For MVP, we can return dummy data or calculate on frontend from full tree.
  return {
    total_burn: 0,
    runway_months: 0,
    active_bets: 0,
    total_revenue: 0,
  };
};
