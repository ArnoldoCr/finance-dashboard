export default function KPICard({ title, value, sub, trend, color, icon }) {
  const isPositive = trend > 0
  return (
    <div
      style={{
        background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
        padding: '1.25rem 1.5rem', boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border)', display: 'flex',
        flexDirection: 'column', gap: '0.5rem', transition: 'box-shadow var(--transition)',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
        <span style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        {trend !== undefined && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.125rem 0.375rem', borderRadius: 'var(--radius-full)', background: isPositive ? '#22c55e22' : '#ef444422', color: isPositive ? 'var(--color-income)' : 'var(--color-expense)' }}>
            {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
        {sub && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>{sub}</span>}
      </div>
    </div>
  )
}