import { useApp } from '../context/AppContext'

const NAV = [
  { id: 'dashboard', icon: '▦', label: 'Dashboard' },
  { id: 'transactions', icon: '⇄', label: 'Transacciones' },
  { id: 'analytics', icon: '◈', label: 'Analíticas' },
  { id: 'import', icon: '⤓', label: 'Importar Excel' },
]

export default function Sidebar() {
  const { activeTab, setActiveTab, theme, toggleTheme, currency, setCurrency, CURRENCIES } = useApp()

  return (
    <aside style={{
      width: '220px', minHeight: '100dvh', background: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)', display: 'flex',
      flexDirection: 'column', padding: '1.5rem 0', position: 'sticky',
      top: 0, boxShadow: 'var(--shadow-sm)', flexShrink: 0
    }}>
      <div style={{ padding: '0 1.25rem 1.5rem', borderBottom: '1px solid var(--color-divider)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="var(--color-primary)" opacity="0.15"/>
            <path d="M8 20 L14 13 L19 17 L24 10" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="24" cy="10" r="2.5" fill="var(--color-primary)"/>
          </svg>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text)' }}>FinanceOS</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)' }}>Personal</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-lg)',
            border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
            fontSize: '0.875rem', fontWeight: activeTab === item.id ? 600 : 400,
            background: activeTab === item.id ? 'var(--color-primary-highlight)' : 'transparent',
            color: activeTab === item.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
            transition: 'all var(--transition)',
          }}>
            <span style={{ fontSize: '1.125rem', width: '20px', textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--color-divider)' }}>
        <label style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>Moneda</label>
        <select value={currency.code} onChange={e => setCurrency(CURRENCIES.find(c => c.code === e.target.value))} style={{
          width: '100%', padding: '0.4375rem 0.625rem', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)', background: 'var(--color-surface-2)',
          color: 'var(--color-text)', fontSize: '0.8125rem', cursor: 'pointer'
        }}>
          {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.symbol}</option>)}
        </select>
      </div>

      <div style={{ padding: '0.75rem 1rem' }}>
        <button onClick={toggleTheme} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)', background: 'var(--color-surface-2)',
          color: 'var(--color-text-muted)', fontSize: '0.8125rem', cursor: 'pointer',
          width: '100%', transition: 'all var(--transition)'
        }}>
          {theme === 'dark' ? '☀️' : '🌙'} {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </div>
    </aside>
  )
}