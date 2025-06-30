"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { useCurrency } from "@/hooks/use-currency"
import { useTransactions } from "@/hooks/use-transactions"
import { useCategories } from "@/hooks/use-categories"
import { CategoryIcon } from "@/components/category-icon"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function Dashboard() {
  const router = useRouter()
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()
  const { transactions } = useTransactions()
  const { getCategoryByName } = useCategories()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const totalBalance = transactions.reduce((sum, transaction) => {
    return transaction.type === "income" ? sum + transaction.amount : sum - transaction.amount
  }, 0)

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const recentTransactions = transactions.slice(0, 5)

  const thisMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date)
    const now = new Date()
    return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()
  })

  const thisMonthIncome = thisMonthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const thisMonthExpenses = thisMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text font-geologica">Finota</h1>
            <p className="text-sm text-light-secondary dark:text-dark-secondary">{t("dashboard.welcome")}</p>
          </div>
        </div>
      </header>

      <main className="px-4 pb-6">
        {/* Balance Overview */}
        <div className="mt-6 space-y-4">
          <Card className="bg-gradient-to-br from-primary to-primary-hover text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-white/80 text-sm font-medium">{t("dashboard.totalBalance")}</p>
                <p className="text-3xl font-bold font-geologica mt-1">{formatCurrency(totalBalance)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-medium">{t("dashboard.income")}</span>
                  </div>
                  <p className="text-xl font-bold">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownRight className="h-4 w-4" />
                    <span className="text-sm font-medium">{t("dashboard.expenses")}</span>
                  </div>
                  <p className="text-xl font-bold">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* This Month Summary */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-light-text dark:text-dark-text font-geologica mb-3">
            {t("dashboard.thisMonth")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-light-secondary dark:text-dark-secondary">{t("dashboard.income")}</span>
                </div>
                <p className="text-xl font-bold text-primary">{formatCurrency(thisMonthIncome)}</p>
              </CardContent>
            </Card>
            <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm text-light-secondary dark:text-dark-secondary">
                    {t("dashboard.expenses")}
                  </span>
                </div>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">{formatCurrency(thisMonthExpenses)}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-light-text dark:text-dark-text font-geologica mb-3">
            {t("dashboard.quickStats")}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-light-text dark:text-dark-text">{transactions.length}</p>
                <p className="text-xs text-light-secondary dark:text-dark-secondary">
                  {t("dashboard.totalTransactions")}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-light-text dark:text-dark-text">{thisMonthTransactions.length}</p>
                <p className="text-xs text-light-secondary dark:text-dark-secondary">{t("dashboard.thisMonthTxn")}</p>
              </CardContent>
            </Card>
            <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {thisMonthExpenses > 0 ? Math.round((thisMonthIncome / thisMonthExpenses) * 100) : 0}%
                </p>
                <p className="text-xs text-light-secondary dark:text-dark-secondary">{t("dashboard.savingsRate")}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-light-text dark:text-dark-text font-geologica">
              {t("dashboard.recentTransactions")}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/transactions")}>
              {t("dashboard.viewAll")}
            </Button>
          </div>
          <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
            <CardContent className="p-0">
              {recentTransactions.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-light-secondary dark:text-dark-secondary">{t("dashboard.noTransactions")}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {recentTransactions.map((transaction) => {
                    const category = getCategoryByName(transaction.category)
                    return (
                      <div key={transaction.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-full"
                            style={{ backgroundColor: `${category?.color || "#6b7280"}20` }}
                          >
                            <CategoryIcon
                              icon={category?.icon || "circle"}
                              color={category?.color || "#6b7280"}
                              size={16}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-light-text dark:text-dark-text text-sm">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-light-secondary dark:text-dark-secondary">
                              {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p
                          className="font-semibold text-sm"
                          style={{
                            color: category?.color || (transaction.type === "income" ? "#22c55e" : "#ef4444"),
                          }}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
