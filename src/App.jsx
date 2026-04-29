import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Analytics from './pages/Analytics'
import ImportExcel from './pages/ImportExcel'

const PAGES = { dashboard: Dashboard, transactions: Transactions, analytics: Analytics, import: ImportExcel }

function AppContent() {
  const { activeTab } = useApp()
  const Page = PAGES[activeTab] || Dashboard
  return (
    <div style={{ display: 'flex', minHeight: '100dvh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxHeight: '100dvh' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Page />
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return <AppProvider><AppContent /></AppProvider>
}