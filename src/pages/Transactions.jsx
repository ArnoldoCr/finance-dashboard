import { useState } from 'react'
import { useApp } from '../context/AppContext'

const CATEGORIES = ['Trabajo','Extra','Inversiones','Hogar','Comida','Transporte','Salud','Entretenimiento','Personal','Otro']

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction, formatMoney, selectedMonth, setSelectedMonth } = useApp()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ description: '', amount: '', type: 'expense', category: 'Otro', date: new Date().toISOString().split('T')[0] })

  const filtered = transactions.filter(t => {
    if (selectedMonth !== 'all' && !t.date.startsWith(selectedMonth)) return false
    if (filter === 'income' && t.amount <= 0) return false
    if (filter === 'expense' && t.amount >= 0) return false
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.description || !form.amount) return
    addTransaction({
      description: form.description,
      amount: form.type === 'expense' ? -Math.abs(parseFloat(form.amount)) : Math.abs(parseFloat(form.amount)),
      type: form.type,
      category: form.category,
      date: form.date
    })
    setForm({ description: '', amount: '', type: 'expense', category: 'Otro', date: new Date().toISOString().split('T')[0] })
    setShowForm(false)
  }

  const handleExport = async () => {
    const ExcelJS = (await import('exceljs')).default
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Transacciones')

    sheet.columns = [
      { header: 'Descripción', key: 'description', width: 25 },
      { header: 'Monto', key: 'amount', width: 15 },
      { header: 'Tipo', key: 'type', width: 12 },
      { header: 'Categoría', key: 'category', width: 18 },
      { header: 'Fecha', key: 'date', width: 15 },
    ]

    filtered.forEach(tx => sheet.addRow({
      description: tx.description,
      amount: tx.amount,
      type: tx.type === 'income' ? 'Ingreso' : 'Gasto',
      category: tx.category,
      date: tx.date,
    }))

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `financeOS-${new Date().toISOString().split('T')[0]}.xlsx`
    a.click()
  }

  const inputStyle = {
    padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)', background: 'var(--color-surface-2)',
    color: 'var(--color-text)', fontSize: '0.875rem', width: '100%'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text)' }}>Transacciones</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{filtered.length} registros</p>
        </div>
        
        <button onClick={handleExport} style={{
          padding: '0.5625rem 1.125rem', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)', background: 'var(--color-surface)',
          color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600,
          cursor: 'pointer', transition: 'all var(--transition)'
        }}>↓ Exportar</button>

        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '0.5625rem 1.125rem', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)', background: 'var(--color-surface)',
          color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600,
          cursor: 'pointer', transition: 'all var(--transition)'
        }}>+ Nueva</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
          padding: '1.25rem', border: '1px solid var(--color-border)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem'
        }}>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Descripción</label>
            <input style={inputStyle} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Ej: Supermercado" required />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Monto</label>
            <input type="number" min="0" step="0.01" style={inputStyle} value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" required />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Tipo</label>
            <select style={inputStyle} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Categoría</label>
            <select style={inputStyle} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Fecha</label>
            <input type="date" style={inputStyle} value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface-offset)', color: 'var(--color-text)', cursor: 'pointer', fontSize: '0.875rem' }}>Cancelar</button>
            <button type="submit" style={{ padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>Guardar</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {['all','income','expense'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border)', fontSize: '0.8125rem', cursor: 'pointer',
            fontWeight: filter === f ? 600 : 400,
            background: filter === f ? 'var(--color-primary)' : 'var(--color-surface)',
            color: filter === f ? '#fff' : 'var(--color-text-muted)',
            transition: 'all var(--transition)'
          }}>{{ all: 'Todos', income: 'Ingresos', expense: 'Gastos' }[f]}</button>
        ))}
<select
  value={selectedMonth}
  onChange={e => setSelectedMonth(e.target.value)}
  style={{
    padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-border)', background: 'var(--color-surface)',
    color: 'var(--color-text)', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 600
  }}
>
  {[
    { value: 'all', label: 'Todos los meses' },
    { value: '2026-04', label: 'Abril 2026' },
    { value: '2026-03', label: 'Marzo 2026' },
    { value: '2026-02', label: 'Febrero 2026' },
    { value: '2026-01', label: 'Enero 2026' },
    { value: '2025-12', label: 'Diciembre 2025' },
    { value: '2025-11', label: 'Noviembre 2025' },
    { value: '2025-10', label: 'Octubre 2025' },
  ].map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
</select>      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-faint)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
            <p>No hay transacciones</p>
          </div>
        ) : filtered.map((tx, i) => (
          <div key={tx.id}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderBottom: i < filtered.length - 1 ? '1px solid var(--color-divider)' : 'none', transition: 'background var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', flexShrink: 0, background: tx.amount > 0 ? '#22c55e18' : '#ef444418', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                {tx.amount > 0 ? '↑' : '↓'}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{tx.description}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>{tx.category} · {tx.date}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: tx.amount > 0 ? 'var(--color-income)' : 'var(--color-expense)' }}>
                {tx.amount > 0 ? '+' : ''}{formatMoney(tx.amount)}
              </span>
              <button onClick={() => deleteTransaction(tx.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-faint)', fontSize: '1rem', padding: '0.25rem', borderRadius: 'var(--radius-sm)', transition: 'color var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-expense)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}
              >✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}