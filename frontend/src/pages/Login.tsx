import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="min-h-screen bg-void text-text-primary">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-ai-flow shadow-glow-ai" />
          <h1 className="mt-4 text-2xl font-semibold">BetMetric</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Authenticate to access the control tower.
          </p>
        </div>

        <div className="surface-card px-6 py-6">
          <form className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
                Email
              </label>
              <input className="input-field mt-2" placeholder="you@company.com" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
                Password
              </label>
              <input
                type="password"
                className="input-field mt-2"
                placeholder="Enter your password"
              />
            </div>
            <Link to="/dashboard" className="neon-button w-full">
              Sign In
            </Link>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-text-tertiary">
          New to BetMetric? <span className="text-text-secondary">Request access.</span>
        </p>
      </div>
    </div>
  )
}
