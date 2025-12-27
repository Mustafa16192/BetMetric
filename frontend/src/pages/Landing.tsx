import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { healthCheck } from '../utils/api'

export default function Landing() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => {
    const checkApi = async () => {
      console.log('Landing page mounted, starting health check...');
      try {
        const result = await healthCheck()
        console.log('Health check success:', result);
        setApiStatus('online')
      } catch (error) {
        console.error('Health check error:', error);
        setApiStatus('offline')
      }
    }
    checkApi()
  }, [])

  return (
    <div className="min-h-screen bg-void text-text-primary relative">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="inline-flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-ai-flow shadow-glow-ai" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">
              BetMetric
            </p>
            <p className="text-sm text-text-secondary">Financial Control Tower</p>
          </div>
        </div>

        <h1 className="mt-8 max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">
          Track strategic bets like a portfolio, not a to-do list.
        </h1>
        <p className="mt-4 max-w-xl text-base text-text-secondary">
          BetMetric reveals which initiatives are burning cash, which are paying off,
          and which are drifting into zombie territory.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/login" className="neon-button">
            Enter Console
          </Link>
          <button type="button" className="ghost-button">
            Request Access
          </button>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="surface-card px-4 py-4">
            <p className="text-sm font-semibold">Strategy Tree</p>
            <p className="mt-2 text-xs text-text-secondary">
              Visualize every bet and its financial health at a glance.
            </p>
          </div>
          <div className="surface-card px-4 py-4">
            <p className="text-sm font-semibold">Truth Ledger</p>
            <p className="mt-2 text-xs text-text-secondary">
              Every transaction tagged, verified, and attributable.
            </p>
          </div>
          <div className="surface-card px-4 py-4">
            <p className="text-sm font-semibold">Escrow Agent</p>
            <p className="mt-2 text-xs text-text-secondary">
              Ask hard questions. Get verified answers in seconds.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-6 flex items-center gap-2 text-xs text-text-tertiary">
        <div 
          className={`h-2 w-2 rounded-full ${
            apiStatus === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
            apiStatus === 'offline' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 
            'bg-yellow-500'
          }`} 
        />
        <span>System: {apiStatus.charAt(0).toUpperCase() + apiStatus.slice(1)}</span>
      </div>
    </div>
  )
}
