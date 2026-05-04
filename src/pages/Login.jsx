import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="var(--color-primary)" />
            <path d="M10 22 L18 12 L26 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 26 L22 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span style={styles.logoText}>FinanceOS</span>
        </div>

        <h1 style={styles.title}>Bienvenido de vuelta</h1>
        <p style={styles.subtitle}>Inicia sesión en tu cuenta</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Correo electrónico</label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={styles.footer}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={styles.link}>Regístrate</Link>
        </p>
      </div>
    </div>
  )
}

function getErrorMessage(code) {
  const messages = {
    'auth/user-not-found': 'No existe una cuenta con ese correo.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/invalid-email': 'El correo no es válido.',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  }
  return messages[code] || 'Ocurrió un error. Intenta de nuevo.'
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-bg)',
    padding: '1.5rem',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-xl)',
    padding: '2.5rem 2rem',
    boxShadow: 'var(--shadow-md)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    marginBottom: '1.75rem',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--color-text)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: '0.375rem',
  },
  subtitle: {
    fontSize: '0.9375rem',
    color: 'var(--color-text-muted)',
    marginBottom: '1.75rem',
  },
  errorBox: {
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(161,44,123,0.08)',
    color: 'var(--color-error)',
    fontSize: '0.875rem',
    marginBottom: '1.25rem',
    border: '1px solid rgba(161,44,123,0.15)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.125rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.375rem' },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  input: {
    padding: '0.625rem 0.875rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'border-color 180ms',
  },
  btn: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    borderRadius: 'var(--radius-lg)',
    border: 'none',
    background: 'var(--color-primary)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.9375rem',
    cursor: 'pointer',
    transition: 'background 180ms',
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
  },
  link: {
    color: 'var(--color-primary)',
    fontWeight: 600,
    textDecoration: 'none',
  },
}