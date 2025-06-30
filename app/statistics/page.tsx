"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Calendar, DollarSign, PieChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/hooks/use-translation"
import { useCurrency } from "@/hooks/use-currency"
import { useTransactions } from "@/hooks/use-transactions"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function Statistics() {
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()
  const { transactions } = useTransactions()
  const [mounted, setMounted] = useState(false)
  const [timeRange, setTimeRange] = useState("thisMonth")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const getFilteredTransactions = () => {
    const now = new Date()
    switch (timeRange) {
      case "thisWeek":
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
        return transactions.filter((t) => new Date(t.date) >= weekStart)
      case "thisMonth":
        return transactions.filter((t) => {
          const date = new Date(t.date)
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        })
      case "last3Months":
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3))
        return transactions.filter((t) => new Date(t.date) >= threeMonthsAgo)
      case "thisYear":
        return transactions.filter((t) => new Date(t.date).getFullYear() === now.getFullYear())
      default:
        return transactions
    }
  }

  const filteredTransactions = getFilteredTransactions()
  const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const netIncome = totalIncome - totalExpenses

  // Category breakdown
  const categoryStats = filteredTransactions.reduce(
    (acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = { income: 0, expense: 0, total: 0 }
      }
      if (transaction.type === "income") {
        acc[transaction.category].income += transaction.amount
      } else {
        acc[transaction.category].expense += transaction.amount
      }
      acc[transaction.category].total += transaction.amount
      return acc
    },
    {} as Record<string, { income: number; expense: number; total: number }>,
  )

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 5)

  // Daily average
  const daysInPeriod = timeRange === "thisWeek" ? 7 : timeRange === "thisMonth" ? 30 : 90
  const dailyAverage = totalExpenses / daysInPeriod

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-light-text dark:text-dark-text font-geologica">
                {t("statistics.title")}
              </h1>
              <p className="text-sm text-light-secondary dark:text-dark-secondary">{t("statistics.subtitle")}</p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisWeek">{t("statistics.thisWeek")}</SelectItem>
                <SelectItem value="thisMonth">{t("statistics.thisMonth")}</SelectItem>
                <SelectItem value="last3Months">{t("statistics.last3Months")}</SelectItem>
                <SelectItem value="thisYear">{t("statistics.thisYear")}</SelectItem>
                <SelectItem value="all">{t("statistics.allTime")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-light-secondary dark:text-dark-secondary">{t("statistics.income")}</span>
              </div>
              <p className="text-xl font-bold text-primary">{formatCurrency(totalIncome)}</p>
            </CardContent>
          </Card>
          <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-light-secondary dark:text-dark-secondary">
                  {t("statistics.expenses")}
                </span>
              </div>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Net Income */}
        <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-light-secondary dark:text-dark-secondary" />
                <span className="font-medium text-light-text dark:text-dark-text">{t("statistics.netIncome")}</span>
              </div>
              <p className={`text-xl font-bold ${netIncome >= 0 ? "text-primary" : "text-red-600 dark:text-red-400"}`}>
                {formatCurrency(netIncome)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Average */}
        <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-light-secondary dark:text-dark-secondary" />
                <span className="font-medium text-light-text dark:text-dark-text">{t("statistics.dailyAverage")}</span>
              </div>
              <p className="text-xl font-bold text-light-text dark:text-dark-text">{formatCurrency(dailyAverage)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-geologica flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              {t("statistics.topCategories")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCategories.map(([category, stats]) => (
              <div
                key={category}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-light-text dark:text-dark-text">{category}</p>
                  <p className="text-sm text-light-secondary dark:text-dark-secondary">
                    {filteredTransactions.filter((t) => t.category === category).length} {t("statistics.transactions")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-light-text dark:text-dark-text">{formatCurrency(stats.total)}</p>
                  {stats.income > 0 && <p className="text-xs text-primary">+{formatCurrency(stats.income)}</p>}
                  {stats.expense > 0 && (
                    <p className="text-xs text-red-600 dark:text-red-400">-{formatCurrency(stats.expense)}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chart Placeholder */}
        <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-geologica">{t("statistics.spendingTrend")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <p className="text-light-secondary dark:text-dark-secondary text-sm">{t("statistics.chartComingSoon")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-geologica">{t("statistics.recentTransactions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredTransactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "income" ? "bg-primary/10" : "bg-red-100 dark:bg-red-900/20"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <TrendingUp className="h-4 w-4 text-primary" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-light-text dark:text-dark-text text-sm">{transaction.description}</p>
                    <p className="text-xs text-light-secondary dark:text-dark-secondary">
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-semibold text-sm ${
                    transaction.type === "income" ? "text-primary" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  )
}
