"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import { useTranslation } from "../../contexts/TranslationContext"
import { useCurrency } from "../../contexts/CurrencyContext"
import { useTransactions } from "../../contexts/TransactionContext"
import { Card } from "../../components/Card"

const { width } = Dimensions.get("window")

export default function Statistics() {
  const { colors, isDark } = useTheme()
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()
  const { transactions } = useTransactions()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const netIncome = totalIncome - totalExpenses

  // This month data
  const thisMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date)
    const now = new Date()
    return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()
  })

  const thisMonthIncome = thisMonthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const thisMonthExpenses = thisMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  // Category breakdown
  const categoryStats = transactions.reduce(
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

  const styles = createStyles(colors, isDark)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>Detailed financial insights</Text>
        </View>

        {/* Overview Cards */}
        <View style={styles.section}>
          <View style={styles.overviewRow}>
            <Card style={[styles.overviewCard, { marginRight: 8 }]}>
              <View style={styles.overviewHeader}>
                <Ionicons name="trending-up" size={16} color={colors.primary} />
                <Text style={styles.overviewLabel}>Income</Text>
              </View>
              <Text style={[styles.overviewAmount, { color: colors.primary }]}>{formatCurrency(totalIncome)}</Text>
            </Card>
            <Card style={[styles.overviewCard, { marginLeft: 8 }]}>
              <View style={styles.overviewHeader}>
                <Ionicons name="trending-down" size={16} color={colors.error} />
                <Text style={styles.overviewLabel}>Expenses</Text>
              </View>
              <Text style={[styles.overviewAmount, { color: colors.error }]}>{formatCurrency(totalExpenses)}</Text>
            </Card>
          </View>
        </View>

        {/* Net Income */}
        <View style={styles.section}>
          <Card>
            <View style={styles.netIncomeRow}>
              <View style={styles.netIncomeLeft}>
                <Ionicons name="wallet" size={20} color={colors.textSecondary} />
                <Text style={styles.netIncomeLabel}>Net Income</Text>
              </View>
              <Text style={[styles.netIncomeAmount, { color: netIncome >= 0 ? colors.primary : colors.error }]}>
                {formatCurrency(netIncome)}
              </Text>
            </View>
          </Card>
        </View>

        {/* This Month Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.monthlyRow}>
            <Card style={[styles.monthlyCard, { marginRight: 8 }]}>
              <Text style={styles.monthlyLabel}>Income</Text>
              <Text style={[styles.monthlyAmount, { color: colors.primary }]}>{formatCurrency(thisMonthIncome)}</Text>
            </Card>
            <Card style={[styles.monthlyCard, { marginLeft: 8 }]}>
              <Text style={styles.monthlyLabel}>Expenses</Text>
              <Text style={[styles.monthlyAmount, { color: colors.error }]}>{formatCurrency(thisMonthExpenses)}</Text>
            </Card>
          </View>
        </View>

        {/* Top Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <Card>
            {topCategories.map(([category, stats], index) => (
              <View key={category}>
                <View style={styles.categoryItem}>
                  <View style={styles.categoryLeft}>
                    <Text style={styles.categoryName}>{category}</Text>
                    <Text style={styles.categoryCount}>
                      {transactions.filter((t) => t.category === category).length} transactions
                    </Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text style={styles.categoryTotal}>{formatCurrency(stats.total)}</Text>
                    {stats.income > 0 && (
                      <Text style={[styles.categorySubAmount, { color: colors.primary }]}>
                        +{formatCurrency(stats.income)}
                      </Text>
                    )}
                    {stats.expense > 0 && (
                      <Text style={[styles.categorySubAmount, { color: colors.error }]}>
                        -{formatCurrency(stats.expense)}
                      </Text>
                    )}
                  </View>
                </View>
                {index < topCategories.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </Card>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Trend</Text>
          <Card>
            <View style={styles.chartPlaceholder}>
              <Ionicons name="bar-chart" size={48} color={colors.textSecondary} />
              <Text style={styles.chartPlaceholderText}>Chart coming soon</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    title: {
      fontSize: 28,
      fontFamily: "Rubik-Bold",
      color: colors.text,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      marginTop: 4,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Rubik-SemiBold",
      color: colors.text,
      marginBottom: 12,
    },
    overviewRow: {
      flexDirection: "row",
    },
    overviewCard: {
      flex: 1,
      padding: 16,
    },
    overviewHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    overviewLabel: {
      fontSize: 12,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      marginLeft: 6,
    },
    overviewAmount: {
      fontSize: 20,
      fontFamily: "Rubik-Bold",
    },
    netIncomeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    netIncomeLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    netIncomeLabel: {
      fontSize: 16,
      fontFamily: "Rubik-Medium",
      color: colors.text,
      marginLeft: 8,
    },
    netIncomeAmount: {
      fontSize: 20,
      fontFamily: "Rubik-Bold",
    },
    monthlyRow: {
      flexDirection: "row",
    },
    monthlyCard: {
      flex: 1,
      padding: 16,
      alignItems: "center",
    },
    monthlyLabel: {
      fontSize: 14,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      marginBottom: 8,
    },
    monthlyAmount: {
      fontSize: 18,
      fontFamily: "Rubik-Bold",
    },
    categoryItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    categoryLeft: {
      flex: 1,
    },
    categoryName: {
      fontSize: 14,
      fontFamily: "Rubik-Medium",
      color: colors.text,
    },
    categoryCount: {
      fontSize: 12,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      marginTop: 2,
    },
    categoryRight: {
      alignItems: "flex-end",
    },
    categoryTotal: {
      fontSize: 14,
      fontFamily: "Rubik-SemiBold",
      color: colors.text,
    },
    categorySubAmount: {
      fontSize: 10,
      fontFamily: "Rubik-Regular",
      marginTop: 2,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
    chartPlaceholder: {
      height: 200,
      alignItems: "center",
      justifyContent: "center",
    },
    chartPlaceholderText: {
      fontSize: 14,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      marginTop: 12,
    },
  })
