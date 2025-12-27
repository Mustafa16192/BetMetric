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
  type: 'revenue' | 'expense';
  description: string;
  date: string;
}

export interface TransactionCreate {
  bet_id: string;
  amount: number;
  type: 'revenue' | 'expense';
  description: string;
  date?: string;
}

export interface Bet {
  id: string;
  name: string;
  budget: number;
  status: 'active' | 'dormant' | 'won' | 'lost';
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
