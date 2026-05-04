import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../firebase'
import {
  collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy
} from 'firebase/firestore'

const AppContext = createContext(null)

const CURRENCIES = [
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
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
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )
  const [currency, setCurrency] = useState(CURRENCIES[0])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('all')

  // Escuchar transacciones en tiempo real desde Firestore
  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setTransactions(data)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme
  }, [theme])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    document.documentElement.style.colorScheme = next
    setTheme(next)
  }

  const addTransaction = async (tx) => {
    await addDoc(collection(db, 'transactions'), tx)
  }

  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, 'transactions', id))
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
      loading,
      formatMoney,
      totalIncome, totalExpenses, balance, savingRate,
      expensesByCategory, MONTHLY_DATA,
      activeTab, setActiveTab,
      sidebarOpen, setSidebarOpen,
      selectedMonth, setSelectedMonth
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)