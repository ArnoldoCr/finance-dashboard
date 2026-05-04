import { useState } from 'react'
import { useApp } from '../context/AppContext'
import ExcelJS from 'exceljs'

const CATEGORY_OPTIONS = ['Trabajo', 'Extra', 'Inversiones', 'Hogar', 'Comida', 'Transporte', 'Salud', 'Entretenimiento', 'Personal', 'Otro']

export default function ImportExcel() {
  const { addTransaction } = useApp()
  const [preview, setPreview] = useState([])
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setError('')
    setDone(false)

    try {
      const buffer = await file.arrayBuffer()
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(buffer)
      const sheet = workbook.worksheets[0]
      const rows = []

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return // skip header
        const [, desc, amount, category, date] = row.values
        if (!desc || amount === undefined) return
        rows.push({
          description: String(desc),
          amount: Number(amount),
          type: Number(amount) >= 0 ? 'income' : 'expense',
          category: String(category || 'Otro'),
          date: date ? String(date).split('T')[0] : new Date().toISOString().split('T')[0],
        })
      })

      setPreview(rows)
    } catch {
      setError('No se pudo leer el archivo. Verifica el formato.')
    }
  }

  const handleImport = async () => {
    setImporting(true)
    for (const tx of preview) {
      await addTransaction(tx)
    }
    setImporting(false)
    setPreview([])
    setDone(true)
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.375rem' }}>Importar Excel</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>Sube un archivo .xlsx con tus transacciones</p>

      {/* Format guide */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.625rem' }}>Formato esperado de columnas:</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['A: (ignorar)', 'B: Descripción', 'C: Monto (+/-)', 'D: Categoría', 'E: Fecha (YYYY-MM-DD)'].map(col => (
            <span key={col} style={{ padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-highlight)', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600 }}>{col}</span>
          ))}
        </div>
      </div>

      {/* Upload */}
      <label style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2rem', borderRadius: 'var(--radius-xl)', cursor: 'pointer',
        border: '2px dashed var(--color-border)', background: 'var(--color-surface)',
        color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '1.5rem',
        transition: 'all var(--transition)'
      }}>
        <span style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📂</span>
        <span style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Haz clic para seleccionar archivo</span>
        <span style={{ fontSize: '0.8125rem' }}>.xlsx, .xls</span>
        <input type="file" accept=".xlsx,.xls" onChange={handleFile} style={{ display: 'none' }} />
      </label>

      {error && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', color: 'var(--color-expense)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</div>
      )}

      {done && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(34,197,94,0.1)', color: 'var(--color-income)', fontSize: '0.875rem', marginBottom: '1rem' }}>✅ Transacciones importadas correctamente</div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-divider)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{preview.length} transacciones encontradas</span>
            <button onClick={handleImport} disabled={importing} style={{
              padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-lg)', border: 'none',
              background: 'var(--color-primary)', color: '#fff', fontWeight: 600,
              fontSize: '0.875rem', cursor: importing ? 'not-allowed' : 'pointer', opacity: importing ? 0.7 : 1
            }}>{importing ? 'Importando...' : '⤓ Importar todo'}</button>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {preview.map((tx, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--color-divider)' }}>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--color-text)', fontSize: '0.9375rem' }}>{tx.description}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{tx.category} · {tx.date}</div>
                </div>
                <span style={{ fontWeight: 700, color: tx.amount >= 0 ? 'var(--color-income)' : 'var(--color-expense)' }}>
                  {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}