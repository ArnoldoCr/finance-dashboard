import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

const CURRENCIES = [
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
]

const SAMPLE_TRANSACTIONS = [
  { id: 1, description: 'Salario', amount: 13500, type: 'income', category: 'Trabajo', date: '2026-04-01' },
  { id: 2, description: 'Renta', amount: -5500, type: 'expense', category: 'Hogar', date: '2026-04-02' },
  { id: 3, description: 'Supermercado', amount: -1200, type: 'expense', category: 'Comida', date: '2026-04-03' },
  { id: 4, description: 'Netflix', amount: -199, type: 'expense', category: 'Entretenimiento', date: '2026-04-05' },
  { id: 5, description: 'Freelance', amount: 3500, type: 'income', category: 'Extra', date: '2026-04-07' },
  { id: 6, description: 'Gasolina', amount: -850, type: 'expense', category: 'Transporte', date: '2026-04-08' },
  { id: 7, description: 'Restaurante', amount: -450, type: 'expense', category: 'Comida', date: '2026-04-10' },
  { id: 8, description: 'Gym', amount: -500, type: 'expense', category: 'Salud', date: '2026-04-12' },
  { id: 9, description: 'Dividendos', amount: 1200, type: 'income', category: 'Inversiones', date: '2026-04-15' },
  { id: 10, description: 'Luz y agua', amount: -780, type: 'expense', category: 'Hogar', date: '2026-04-16' },
  { id: 11, description: 'Ropa', amount: -1100, type: 'expense', category: 'Personal', date: '2026-04-18' },
  { id: 12, description: 'Farmacia', amount: -320, type: 'expense', category: 'Salud', date: '2026-04-20' },
  { id: 13, description: 'Uber', amount: -180, type: 'expense', category: 'Transporte', date: '2026-04-22' },
  { id: 14, description: 'Spotify', amount: -99, type: 'expense', category: 'Entretenimiento', date: '2026-04-23' },
  { id: 15, description: 'Bono proyecto', amount: 2500, type: 'income', category: 'Extra', date: '2026-04-25' },
]

const MONTHLY_DATA = [
  { month: 'Oct', income: 19000, expenses: 11200, saving: 7800 },
  { month: 'Nov', income: 20500, expenses: 13400, saving: 7100 },
  { month: 'Dic', income: 24000, expenses: 18200, saving: 5800 },
  { month: 'Ene', income: 18000, expenses: 10500, saving: 7500 },
  { month: 'Feb', income: 19500, expenses: 11800, saving: 7700 },
  { month: 'Mar', income: 21000, expenses: 12200, saving: 8800 },
  { month: 'Abr', income: 25200, expenses: 11178, saving: 14022 },
]

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [currency, setCurrency] = useState(CURRENCIES[0])
  const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedMonth, setSelectedMonth] = useState('all')

    useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme
    }, [theme])

    const toggleTheme = () => setTheme(t => {
    const next = t === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    document.documentElement.style.colorScheme = next
    return next
    })

  const addTransaction = (tx) => {
    setTransactions(prev => [{ ...tx, id: Date.now() }, ...prev])
  }

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const formatMoney = (amount) => {
    const abs = Math.abs(amount)
    const formatted = new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(abs)
    return `${currency.symbol}${formatted} ${currency.code}`
  }

  const filteredByMonth = selectedMonth === 'all'
    ? transactions
    : transactions.filter(t => t.date.startsWith(selectedMonth))

  const totalIncome = filteredByMonth.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const totalExpenses = Math.abs(filteredByMonth.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0))
  const balance = totalIncome - totalExpenses
  const savingRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0

  const expensesByCategory = filteredByMonth
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
      return acc
    }, {})

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      currency, setCurrency, CURRENCIES,
      transactions, addTransaction, deleteTransaction,
      formatMoney,
      totalIncome, totalExpenses, balance, savingRate,
      expensesByCategory, MONTHLY_DATA,
      activeTab, setActiveTab,
      selectedMonth, setSelectedMonth
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)