import { useEffect } from 'react'

export function usePageTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle
      ? `FinanceNOS · ${pageTitle}`
      : 'FinanceNOS'
  }, [pageTitle])
}