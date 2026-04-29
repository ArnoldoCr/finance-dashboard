import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useApp } from '../context/AppContext'

const COLORS = ['#6c3fc5','#3b82f6','#22c55e','#f59e0b','#ef4444','#a855f7','#06b6d4']

export default function Analytics() {
  const { expensesByCategory, MONTHLY_DATA, formatMoney, savingRate, totalIncome, totalExpenses } = useApp()

  const catData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text)' }}>Analíticas</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Desglose detallado de tus finanzas</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>Tasa de ahorro</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>{savingRate}%</span>
        </div>
        <div style={{ height: '10px', background: 'var(--color-surface-offset)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${savingRate}%`, background: 'var(--color-primary)', borderRadius: '99px', transition: 'width 0.8s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>
          <span>Gastos: {formatMoney(totalExpenses)}</span>
          <span>Ingresos: {formatMoney(totalIncome)}</span>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text)' }}>Comparativo mensual</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, bottom: 0, left: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-faint)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => formatMoney(v)} contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px', color: 'var(--color-text)' }} />
            <Bar dataKey="income" name="Ingresos" fill="#22c55e" radius={[4,4,0,0]} />
            <Bar dataKey="expenses" name="Gastos" fill="#ef4444" radius={[4,4,0,0]} />
            <Bar dataKey="saving" name="Ahorro" fill="#6c3fc5" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text)' }}>Gastos por categoría</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={catData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-text-faint)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} width={58} />
            <Tooltip formatter={(v) => formatMoney(v)} contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px', color: 'var(--color-text)' }} />
            <Bar dataKey="value" radius={[0,4,4,0]}>
              {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}