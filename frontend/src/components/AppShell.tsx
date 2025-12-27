import { Outlet } from 'react-router-dom'
import EscrowChat from './EscrowChat'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-void text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopBar />
          <main className="flex-1 px-6 py-6 md:px-10">
            <Outlet />
          </main>
        </div>
      </div>
      <EscrowChat />
    </div>
  )
}
