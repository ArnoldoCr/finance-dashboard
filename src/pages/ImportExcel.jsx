import { useState } from 'react'
import * as XLSX from 'xlsx'
import { useApp } from '../context/AppContext'

export default function ImportExcel() {
  const { addTransaction } = useApp()
  const [preview, setPreview] = useState([])
  const [status, setStatus] = useState(null)
  const [dragging, setDragging] = useState(false)

  const processFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(ws)
        setPreview(data.slice(0, 10))
        setStatus({ type: 'preview', count: data.length, data })
      } catch {
        setStatus({ type: 'error', message: 'No se pudo leer el archivo.' })
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleFile = (e) => processFile(e.target.files[0])
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]) }

  const handleImport = () => {
    if (!status?.data) return
    status.data.forEach(row => {
      addTransaction({
        description: row.description || row.Descripción || row.concepto || 'Sin descripción',
        amount: parseFloat(row.amount || row.monto || row.Monto || 0),
        type: parseFloat(row.amount || row.monto || 0) >= 0 ? 'income' : 'expense',
        category: row.category || row.categoria || row.Categoría || 'Otro',
        date: row.date || row.fecha || row.Fecha || new Date().toISOString().split('T')[0]
      })
    })
    setStatus({ type: 'success', count: status.data.length })
    setPreview([])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '720px' }}>
      <div>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text)' }}>Importar Excel</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Sube un archivo .xlsx con tus transacciones</p>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('xlsxInput').click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-xl)', padding: '2.5rem', textAlign: 'center',
          background: dragging ? 'var(--color-primary-highlight)' : 'var(--color-surface)',
          transition: 'all var(--transition)', cursor: 'pointer'
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📂</div>
        <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>Arrastra tu archivo aquí</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>o haz clic para seleccionar</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', marginTop: '0.5rem' }}>Formatos: .xlsx, .xls, .csv</p>
        <input id="xlsxInput" type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} style={{ display: 'none' }} />
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text)' }}>📋 Formato esperado del Excel</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)' }}>
                {['description','amount','category','date'].map(h => (
                  <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--color-primary)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[['Salario','18000','Trabajo','2026-04-01'],['Renta','-5500','Hogar','2026-04-02'],['Supermercado','-1200','Comida','2026-04-03']].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-divider)' }}>
                  {row.map((cell, j) => <td key={j} style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-muted)' }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', marginTop: '0.75rem' }}>
          💡 Gastos con monto negativo (-), ingresos positivo. También acepta: <em>descripción, monto, categoría, fecha</em>
        </p>
      </div>

      {preview.length > 0 && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text)' }}>Vista previa ({status.count} filas)</h2>
          <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-2)' }}>
                  {Object.keys(preview[0]).map(k => <th key={k} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600, borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>{k}</th>)}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-divider)' }}>
                    {Object.values(row).map((v, j) => <td key={j} style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{String(v)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleImport} style={{ padding: '0.5625rem 1.25rem', borderRadius: 'var(--radius-lg)', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
            ✓ Importar {status.count} transacciones
          </button>
        </div>
      )}

      {status?.type === 'success' && (
        <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', background: '#22c55e18', border: '1px solid #22c55e44', color: 'var(--color-income)', fontWeight: 600 }}>
          ✅ {status.count} transacciones importadas correctamente
        </div>
      )}
      {status?.type === 'error' && (
        <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', background: '#ef444418', border: '1px solid #ef444444', color: 'var(--color-expense)', fontWeight: 600 }}>
          ❌ {status.message}
        </div>
      )}
    </div>
  )
}