"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  type: "income" | "expense"
  date: string
  notes?: string
}

const defaultTransactions: Transaction[] = [
  {
    id: "1",
    description: "Salary",
    amount: 5000,
    category: "Salary",
    type: "income",
    date: "2024-01-15",
    notes: "Monthly salary",
  },
  {
    id: "2",
    description: "Groceries",
    amount: 120,
    category: "Food",
    type: "expense",
    date: "2024-01-14",
  },
  {
    id: "3",
    description: "Coffee",
    amount: 4.5,
    category: "Food",
    type: "expense",
    date: "2024-01-14",
  },
]

interface TransactionContextType {
  transactions: Transaction[]
  addTransaction: (transactionData: Omit<Transaction, "id">) => Promise<Transaction>
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const saved = await AsyncStorage.getItem("finota-transactions")
      if (saved) {
        setTransactions(JSON.parse(saved))
      } else {
        setTransactions(defaultTransactions)
        await AsyncStorage.setItem("finota-transactions", JSON.stringify(defaultTransactions))
      }
    } catch (error) {
      console.error("Error loading transactions:", error)
      setTransactions(defaultTransactions)
    }
  }

  const saveTransactions = async (newTransactions: Transaction[]) => {
    try {
      setTransactions(newTransactions)
      await AsyncStorage.setItem("finota-transactions", JSON.stringify(newTransactions))
    } catch (error) {
      console.error("Error saving transactions:", error)
    }
  }

  const addTransaction = async (transactionData: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
    }

    const newTransactions = [newTransaction, ...transactions]
    await saveTransactions(newTransactions)
    return newTransaction
  }

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const newTransactions = transactions.map((t) => (t.id === id ? { ...t, ...updates } : t))
    saveTransactions(newTransactions)
  }

  const deleteTransaction = (id: string) => {
    const newTransactions = transactions.filter((t) => t.id !== id)
    saveTransactions(newTransactions)
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider")
  }
  return context
}
