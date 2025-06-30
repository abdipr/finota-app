"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

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

interface CurrencyContextType {
  currency: string
  setCurrency: (currency: string) => void
  formatCurrency: (amount: number) => string
  currencies: Currency[]
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState("USD")

  useEffect(() => {
    loadCurrency()
  }, [])

  const loadCurrency = async () => {
    try {
      const savedCurrency = await AsyncStorage.getItem("finota-currency")
      if (savedCurrency && currencies.find((c) => c.code === savedCurrency)) {
        setCurrencyState(savedCurrency)
      }
    } catch (error) {
      console.error("Error loading currency:", error)
    }
  }

  const setCurrency = async (code: string) => {
    try {
      setCurrencyState(code)
      await AsyncStorage.setItem("finota-currency", code)
    } catch (error) {
      console.error("Error saving currency:", error)
    }
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

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency, currencies }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
