"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Language = "en" | "id" | "es" | "fr"

const translations = {
  en: {
    "dashboard.welcome": "Welcome back!",
    "dashboard.totalBalance": "Total Balance",
    "dashboard.income": "Income",
    "dashboard.expenses": "Expenses",
    "dashboard.thisMonth": "This Month",
    "dashboard.quickStats": "Quick Stats",
    "dashboard.totalTransactions": "Total Transactions",
    "dashboard.thisMonthTxn": "This Month",
    "dashboard.savingsRate": "Savings Rate",
    "dashboard.recentTransactions": "Recent Transactions",
    "dashboard.viewAll": "View All",
    "dashboard.noTransactions": "No transactions yet",
    "nav.dashboard": "Dashboard",
    "nav.statistics": "Statistics",
    "nav.add": "Add",
    "nav.reminders": "Reminders",
    "nav.profile": "Profile",
    "addTransaction.title": "Add Transaction",
    "addTransaction.subtitle": "Record your income or expense",
    "addTransaction.type": "Transaction Type",
    "addTransaction.income": "Income",
    "addTransaction.expense": "Expense",
    "addTransaction.description": "Description",
    "addTransaction.amount": "Amount",
    "addTransaction.category": "Category",
    "addTransaction.date": "Date",
    "addTransaction.notes": "Notes",
    "addTransaction.save": "Save Transaction",
    "addTransaction.cancel": "Cancel",
  },
  id: {
    "dashboard.welcome": "Selamat datang kembali!",
    "dashboard.totalBalance": "Total Saldo",
    "dashboard.income": "Pemasukan",
    "dashboard.expenses": "Pengeluaran",
    "dashboard.thisMonth": "Bulan Ini",
    "dashboard.quickStats": "Statistik Cepat",
    "dashboard.totalTransactions": "Total Transaksi",
    "dashboard.thisMonthTxn": "Bulan Ini",
    "dashboard.savingsRate": "Tingkat Tabungan",
    "dashboard.recentTransactions": "Transaksi Terbaru",
    "dashboard.viewAll": "Lihat Semua",
    "dashboard.noTransactions": "Belum ada transaksi",
    "nav.dashboard": "Dashboard",
    "nav.statistics": "Statistik",
    "nav.add": "Tambah",
    "nav.reminders": "Pengingat",
    "nav.profile": "Profil",
    "addTransaction.title": "Tambah Transaksi",
    "addTransaction.subtitle": "Catat pemasukan atau pengeluaran",
    "addTransaction.type": "Jenis Transaksi",
    "addTransaction.income": "Pemasukan",
    "addTransaction.expense": "Pengeluaran",
    "addTransaction.description": "Deskripsi",
    "addTransaction.amount": "Jumlah",
    "addTransaction.category": "Kategori",
    "addTransaction.date": "Tanggal",
    "addTransaction.notes": "Catatan",
    "addTransaction.save": "Simpan Transaksi",
    "addTransaction.cancel": "Batal",
  },
  es: {
    "dashboard.welcome": "¡Bienvenido de vuelta!",
    "dashboard.totalBalance": "Saldo Total",
    "dashboard.income": "Ingresos",
    "dashboard.expenses": "Gastos",
    "dashboard.thisMonth": "Este Mes",
    "dashboard.quickStats": "Estadísticas Rápidas",
    "dashboard.totalTransactions": "Total de Transacciones",
    "dashboard.thisMonthTxn": "Este Mes",
    "dashboard.savingsRate": "Tasa de Ahorro",
    "dashboard.recentTransactions": "Transacciones Recientes",
    "dashboard.viewAll": "Ver Todo",
    "dashboard.noTransactions": "Aún no hay transacciones",
    "nav.dashboard": "Panel",
    "nav.statistics": "Estadísticas",
    "nav.add": "Agregar",
    "nav.reminders": "Recordatorios",
    "nav.profile": "Perfil",
    "addTransaction.title": "Agregar Transacción",
    "addTransaction.subtitle": "Registra tus ingresos o gastos",
    "addTransaction.type": "Tipo de Transacción",
    "addTransaction.income": "Ingreso",
    "addTransaction.expense": "Gasto",
    "addTransaction.description": "Descripción",
    "addTransaction.amount": "Cantidad",
    "addTransaction.category": "Categoría",
    "addTransaction.date": "Fecha",
    "addTransaction.notes": "Notas",
    "addTransaction.save": "Guardar Transacción",
    "addTransaction.cancel": "Cancelar",
  },
  fr: {
    "dashboard.welcome": "Bon retour !",
    "dashboard.totalBalance": "Solde Total",
    "dashboard.income": "Revenus",
    "dashboard.expenses": "Dépenses",
    "dashboard.thisMonth": "Ce Mois",
    "dashboard.quickStats": "Statistiques Rapides",
    "dashboard.totalTransactions": "Total des Transactions",
    "dashboard.thisMonthTxn": "Ce Mois",
    "dashboard.savingsRate": "Taux d'Épargne",
    "dashboard.recentTransactions": "Transactions Récentes",
    "dashboard.viewAll": "Voir Tout",
    "dashboard.noTransactions": "Aucune transaction pour le moment",
    "nav.dashboard": "Tableau de Bord",
    "nav.statistics": "Statistiques",
    "nav.add": "Ajouter",
    "nav.reminders": "Rappels",
    "nav.profile": "Profil",
    "addTransaction.title": "Ajouter Transaction",
    "addTransaction.subtitle": "Enregistrez vos revenus ou dépenses",
    "addTransaction.type": "Type de Transaction",
    "addTransaction.income": "Revenu",
    "addTransaction.expense": "Dépense",
    "addTransaction.description": "Description",
    "addTransaction.amount": "Montant",
    "addTransaction.category": "Catégorie",
    "addTransaction.date": "Date",
    "addTransaction.notes": "Notes",
    "addTransaction.save": "Sauvegarder Transaction",
    "addTransaction.cancel": "Annuler",
  },
}

interface TranslationContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    loadLanguage()
  }, [])

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("finota-language")
      if (savedLanguage && translations[savedLanguage as Language]) {
        setLanguageState(savedLanguage as Language)
      }
    } catch (error) {
      console.error("Error loading language:", error)
    }
  }

  const setLanguage = async (newLanguage: Language) => {
    try {
      setLanguageState(newLanguage)
      await AsyncStorage.setItem("finota-language", newLanguage)
    } catch (error) {
      console.error("Error saving language:", error)
    }
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[Language]] || key
  }

  return <TranslationContext.Provider value={{ language, setLanguage, t }}>{children}</TranslationContext.Provider>
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
