"use client"

import { useState, useEffect } from "react"

export interface Category {
  id: string
  name: string
  type: "income" | "expense"
  icon: string
  color: string
}

const defaultCategories: Category[] = [
  { id: "1", name: "Food", type: "expense", icon: "utensils", color: "#ef4444" },
  { id: "2", name: "Transport", type: "expense", icon: "car", color: "#3b82f6" },
  { id: "3", name: "Shopping", type: "expense", icon: "shopping-bag", color: "#8b5cf6" },
  { id: "4", name: "Bills", type: "expense", icon: "file-text", color: "#f59e0b" },
  { id: "5", name: "Entertainment", type: "expense", icon: "film", color: "#ec4899" },
  { id: "6", name: "Health", type: "expense", icon: "heart", color: "#10b981" },
  { id: "7", name: "Education", type: "expense", icon: "book", color: "#6366f1" },
  { id: "8", name: "Salary", type: "income", icon: "briefcase", color: "#22c55e" },
  { id: "9", name: "Freelance", type: "income", icon: "laptop", color: "#06b6d4" },
  { id: "10", name: "Investment", type: "income", icon: "trending-up", color: "#84cc16" },
]

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("finota-categories")
    if (saved) {
      try {
        setCategories(JSON.parse(saved))
      } catch {
        setCategories(defaultCategories)
        localStorage.setItem("finota-categories", JSON.stringify(defaultCategories))
      }
    } else {
      setCategories(defaultCategories)
      localStorage.setItem("finota-categories", JSON.stringify(defaultCategories))
    }
  }, [])

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories)
    localStorage.setItem("finota-categories", JSON.stringify(newCategories))
  }

  const addCategory = (categoryData: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    }
    const newCategories = [...categories, newCategory]
    saveCategories(newCategories)
    return newCategory
  }

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const newCategories = categories.map((c) => (c.id === id ? { ...c, ...updates } : c))
    saveCategories(newCategories)
  }

  const deleteCategory = (id: string) => {
    const newCategories = categories.filter((c) => c.id !== id)
    saveCategories(newCategories)
  }

  const getCategoryByName = (name: string) => {
    return categories.find((c) => c.name === name)
  }

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryByName,
  }
}
