"use client"

import { useState, useEffect } from "react"

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
  {
    id: "4",
    description: "Freelance Project",
    amount: 800,
    category: "Freelance",
    type: "income",
    date: "2024-01-13",
    notes: "Web development project",
  },
  {
    id: "5",
    description: "Gas",
    amount: 45,
    category: "Transport",
    type: "expense",
    date: "2024-01-12",
  },
  {
    id: "6",
    description: "Movie Tickets",
    amount: 25,
    category: "Entertainment",
    type: "expense",
    date: "2024-01-11",
  },
]

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("finota-transactions")
    if (saved) {
      try {
        setTransactions(JSON.parse(saved))
      } catch {
        setTransactions(defaultTransactions)
      }
    } else {
      setTransactions(defaultTransactions)
    }
  }, [])

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions)
    localStorage.setItem("finota-transactions", JSON.stringify(newTransactions))
  }

  const addTransaction = async (transactionData: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
    }

    const newTransactions = [newTransaction, ...transactions]
    saveTransactions(newTransactions)
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

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
