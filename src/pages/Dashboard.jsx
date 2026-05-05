import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { useApp } from '../context/AppContext'
import KPICard from '../components/KPICard'
import { usePageTitle } from '../hooks/usePageTitle'

const COLORS = ['#6c3fc5','#3b82f6','#22c55e','#f59e0b','#ef4444','#a855f7','#06b6d4']

const CustomTooltip = ({ active, payload, label, formatMoney }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)', padding: '0.75rem 1rem',
      boxShadow: 'var(--shadow-lg)', fontSize: '0.8125rem'
    }}>
      <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text)' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {formatMoney(p.value)}</p>
      ))}
    </div>
  )
}

const MONTHS = [
  { value: 'all', label: 'Todos los meses' },
  { value: '2026-04', label: 'Abril 2026' },
  { value: '2026-03', label: 'Marzo 2026' },
  { value: '2026-02', label: 'Febrero 2026' },
  { value: '2026-01', label: 'Enero 2026' },
  { value: '2025-12', label: 'Diciembre 2025' },
  { value: '2025-11', label: 'Noviembre 2025' },
  { value: '2025-10', label: 'Octubre 2025' },
]

function MonthSelector() {
  const { selectedMonth, setSelectedMonth } = useApp()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Mostrando:</span>
      <select
        value={selectedMonth}
        onChange={e => setSelectedMonth(e.target.value)}
        style={{
          padding: '0.3125rem 0.75rem', borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-border)', background: 'var(--color-surface)',
          color: 'var(--color-text)', fontSize: '0.8125rem', cursor: 'pointer',
          fontWeight: 600
        }}
      >
        {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
    </div>
  )
}

export default function Dashboard() {
  usePageTitle('Dashboard')
  const { totalIncome, totalExpenses, balance, savingRate, formatMoney, expensesByCategory, MONTHLY_DATA, transactions } = useApp()

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }))
  const recent = transactions.slice(0, 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text)' }}>Dashboard</h1>
        <MonthSelector />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <KPICard title="Balance Total" value={formatMoney(balance)} sub="Este mes" trend={12} color="#6c3fc5" icon="💰" />
        <KPICard title="Ingresos" value={formatMoney(totalIncome)} sub="Este mes" trend={8} color="#22c55e" icon="📈" />
        <KPICard title="Gastos" value={formatMoney(totalExpenses)} sub="Este mes" trend={-3} color="#ef4444" icon="📉" />
        <KPICard title="Tasa de ahorro" value={`${savingRate}%`} sub="del ingreso" trend={5} color="#3b82f6" icon="🏦" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1rem' }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text)' }}>Flujo de dinero — últimos 7 meses</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gSaving" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c3fc5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6c3fc5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-faint)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip formatMoney={formatMoney} />} />
              <Area type="monotone" dataKey="income" name="Ingresos" stroke="#22c55e" strokeWidth={2} fill="url(#gIncome)" />
              <Area type="monotone" dataKey="expenses" name="Gastos" stroke="#ef4444" strokeWidth={2} fill="url(#gExpense)" />
              <Area type="monotone" dataKey="saving" name="Ahorro" stroke="#6c3fc5" strokeWidth={2} fill="url(#gSaving)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text)' }}>Gastos por categoría</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => formatMoney(v)} contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px', color: 'var(--color-text)' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: 'var(--color-text-muted)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text)' }}>Transacciones recientes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {recent.map(tx => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: tx.amount > 0 ? '#22c55e22' : '#ef444422', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                  {tx.amount > 0 ? '↑' : '↓'}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>{tx.description}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>{tx.category} · {tx.date}</div>
                </div>
              </div>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: tx.amount > 0 ? 'var(--color-income)' : 'var(--color-expense)' }}>
                {tx.amount > 0 ? '+' : ''}{formatMoney(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}