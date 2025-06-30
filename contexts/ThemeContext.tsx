"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Theme = "light" | "dark" | "system"

interface ThemeColors {
  primary: string
  background: string
  card: string
  text: string
  textSecondary: string
  border: string
  error: string
  success: string
  warning: string
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  colors: ThemeColors
  isDark: boolean
}

const lightColors: ThemeColors = {
  primary: "#22C55E",
  background: "#F0F6FF",
  card: "#FFFFFF",
  text: "#1E293B",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  error: "#EF4444",
  success: "#22C55E",
  warning: "#F59E0B",
}

const darkColors: ThemeColors = {
  primary: "#22C55E",
  background: "#0F172A",
  card: "#1E293B",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  border: "#334155",
  error: "#EF4444",
  success: "#22C55E",
  warning: "#F59E0B",
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme()
  const [theme, setThemeState] = useState<Theme>("system")

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("finota-theme")
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setThemeState(savedTheme as Theme)
      }
    } catch (error) {
      console.error("Error loading theme:", error)
    }
  }

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme)
      await AsyncStorage.setItem("finota-theme", newTheme)
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  }

  const isDark = theme === "dark" || (theme === "system" && systemColorScheme === "dark")
  const colors = isDark ? darkColors : lightColors

  return <ThemeContext.Provider value={{ theme, setTheme, colors, isDark }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
