"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Category {
  id: string
  name: string
  type: "income" | "expense"
  icon: string
  color: string
}

const defaultCategories: Category[] = [
  { id: "1", name: "Food", type: "expense", icon: "restaurant", color: "#ef4444" },
  { id: "2", name: "Transport", type: "expense", icon: "car", color: "#3b82f6" },
  { id: "3", name: "Shopping", type: "expense", icon: "bag", color: "#8b5cf6" },
  { id: "4", name: "Bills", type: "expense", icon: "receipt", color: "#f59e0b" },
  { id: "5", name: "Entertainment", type: "expense", icon: "film", color: "#ec4899" },
  { id: "6", name: "Health", type: "expense", icon: "medical", color: "#10b981" },
  { id: "7", name: "Education", type: "expense", icon: "school", color: "#6366f1" },
  { id: "8", name: "Salary", type: "income", icon: "briefcase", color: "#22c55e" },
  { id: "9", name: "Freelance", type: "income", icon: "laptop", color: "#06b6d4" },
  { id: "10", name: "Investment", type: "income", icon: "trending-up", color: "#84cc16" },
]

interface CategoryContextType {
  categories: Category[]
  addCategory: (categoryData: Omit<Category, "id">) => Category
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  getCategoryByName: (name: string) => Category | undefined
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const saved = await AsyncStorage.getItem("finota-categories")
      if (saved) {
        setCategories(JSON.parse(saved))
      } else {
        setCategories(defaultCategories)
        await AsyncStorage.setItem("finota-categories", JSON.stringify(defaultCategories))
      }
    } catch (error) {
      console.error("Error loading categories:", error)
      setCategories(defaultCategories)
    }
  }

  const saveCategories = async (newCategories: Category[]) => {
    try {
      setCategories(newCategories)
      await AsyncStorage.setItem("finota-categories", JSON.stringify(newCategories))
    } catch (error) {
      console.error("Error saving categories:", error)
    }
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

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryByName,
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoryContext)
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider")
  }
  return context
}
