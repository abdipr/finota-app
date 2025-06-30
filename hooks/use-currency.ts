"use client"

import { useState, useEffect } from "react"

interface Currency {
  code: string
  name: string
  symbol: string
}

export const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
]

export function useCurrency() {
  const [currency, setCurrencyState] = useState("USD")

  useEffect(() => {
    const saved = localStorage.getItem("finota-currency")
    if (saved && currencies.find((c) => c.code === saved)) {
      setCurrencyState(saved)
    }
  }, [])

  const setCurrency = (code: string) => {
    setCurrencyState(code)
    localStorage.setItem("finota-currency", code)
  }

  const formatCurrency = (amount: number): string => {
    const currencyData = currencies.find((c) => c.code === currency)
    if (!currencyData) return amount.toString()

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: currency === "IDR" ? 0 : 2,
        maximumFractionDigits: currency === "IDR" ? 0 : 2,
      }).format(amount)
    } catch {
      return `${currencyData.symbol}${amount.toLocaleString()}`
    }
  }

  return { currency, setCurrency, formatCurrency, currencies }
}
