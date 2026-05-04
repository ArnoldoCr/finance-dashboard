import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Analytics from './pages/Analytics'
import ImportExcel from './pages/ImportExcel'

const PAGES = { dashboard: Dashboard, transactions: Transactions, analytics: Analytics, import: ImportExcel }

function AppContent() {
  const { activeTab, setSidebarOpen } = useApp()
  const Page = PAGES[activeTab] || Dashboard
  return (
    <div style={{ display: 'flex', minHeight: '100dvh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar móvil */}
        <header className="mobile-topbar" style={{
          display: 'none', alignItems: 'center', gap: '0.75rem',
          padding: '0.875rem 1rem', background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)', position: 'sticky',
          top: 0, zIndex: 30
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text)', fontSize: '1.25rem', padding: '0.25rem',
              display: 'flex', alignItems: 'center'
            }}
          >☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)" opacity="0.15"/>
              <path d="M8 20 L14 13 L19 17 L24 10" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="24" cy="10" r="2.5" fill="var(--color-primary)"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text)' }}>FinanceOS</span>
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <Page />
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <AppProvider><AppContent /></AppProvider>
}