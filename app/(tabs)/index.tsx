"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useTheme } from "../../contexts/ThemeContext"
import { useTranslation } from "../../contexts/TranslationContext"
import { useCurrency } from "../../contexts/CurrencyContext"
import { useTransactions } from "../../contexts/TransactionContext"
import { useCategories } from "../../contexts/CategoryContext"
import { Card } from "../../components/Card"
import { CategoryIcon } from "../../components/CategoryIcon"

const { width } = Dimensions.get("window")

export default function Dashboard() {
  const router = useRouter()
  const { colors, isDark } = useTheme()
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

  const styles = createStyles(colors, isDark)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Finota</Text>
            <Text style={styles.subtitle}>{t("dashboard.welcome")}</Text>
          </View>
        </View>

        {/* Balance Overview */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t("dashboard.totalBalance")}</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>

          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <View style={styles.balanceIconContainer}>
                <Ionicons name="trending-up" size={16} color="#fff" />
              </View>
              <Text style={styles.balanceItemLabel}>{t("dashboard.income")}</Text>
              <Text style={styles.balanceItemAmount}>{formatCurrency(totalIncome)}</Text>
            </View>
            <View style={styles.balanceItem}>
              <View style={styles.balanceIconContainer}>
                <Ionicons name="trending-down" size={16} color="#fff" />
              </View>
              <Text style={styles.balanceItemLabel}>{t("dashboard.expenses")}</Text>
              <Text style={styles.balanceItemAmount}>{formatCurrency(totalExpenses)}</Text>
            </View>
          </View>
        </View>

        {/* This Month Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("dashboard.thisMonth")}</Text>
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { flex: 1, marginRight: 8 }]}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: colors.primary + "20" }]}>
                  <Ionicons name="trending-up" size={16} color={colors.primary} />
                </View>
                <Text style={styles.statLabel}>{t("dashboard.income")}</Text>
              </View>
              <Text style={[styles.statAmount, { color: colors.primary }]}>{formatCurrency(thisMonthIncome)}</Text>
            </Card>
            <Card style={[styles.statCard, { flex: 1, marginLeft: 8 }]}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: colors.error + "20" }]}>
                  <Ionicons name="trending-down" size={16} color={colors.error} />
                </View>
                <Text style={styles.statLabel}>{t("dashboard.expenses")}</Text>
              </View>
              <Text style={[styles.statAmount, { color: colors.error }]}>{formatCurrency(thisMonthExpenses)}</Text>
            </Card>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("dashboard.quickStats")}</Text>
          <View style={styles.quickStatsRow}>
            <Card style={styles.quickStatCard}>
              <Text style={styles.quickStatNumber}>{transactions.length}</Text>
              <Text style={styles.quickStatLabel}>{t("dashboard.totalTransactions")}</Text>
            </Card>
            <Card style={styles.quickStatCard}>
              <Text style={styles.quickStatNumber}>{thisMonthTransactions.length}</Text>
              <Text style={styles.quickStatLabel}>{t("dashboard.thisMonthTxn")}</Text>
            </Card>
            <Card style={styles.quickStatCard}>
              <Text style={[styles.quickStatNumber, { color: colors.primary }]}>
                {thisMonthExpenses > 0 ? Math.round((thisMonthIncome / thisMonthExpenses) * 100) : 0}%
              </Text>
              <Text style={styles.quickStatLabel}>{t("dashboard.savingsRate")}</Text>
            </Card>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("dashboard.recentTransactions")}</Text>
            <TouchableOpacity onPress={() => router.push("/transactions")}>
              <Text style={styles.viewAllButton}>{t("dashboard.viewAll")}</Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.transactionsCard}>
            {recentTransactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>{t("dashboard.noTransactions")}</Text>
              </View>
            ) : (
              recentTransactions.map((transaction, index) => {
                const category = getCategoryByName(transaction.category)
                return (
                  <View key={transaction.id}>
                    <View style={styles.transactionItem}>
                      <View style={styles.transactionLeft}>
                        <View
                          style={[
                            styles.transactionIcon,
                            { backgroundColor: (category?.color || colors.textSecondary) + "20" },
                          ]}
                        >
                          <CategoryIcon
                            icon={category?.icon || "help-circle"}
                            color={category?.color || colors.textSecondary}
                            size={16}
                          />
                        </View>
                        <View style={styles.transactionDetails}>
                          <Text style={styles.transactionDescription}>{transaction.description}</Text>
                          <Text style={styles.transactionMeta}>
                            {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.transactionAmount,
                          { color: category?.color || (transaction.type === "income" ? colors.primary : colors.error) },
                        ]}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </Text>
                    </View>
                    {index < recentTransactions.length - 1 && <View style={styles.separator} />}
                  </View>
                )
              })
            )}
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
    balanceCard: {
      backgroundColor: colors.primary,
      marginHorizontal: 20,
      marginVertical: 16,
      borderRadius: 20,
      padding: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    balanceLabel: {
      fontSize: 14,
      fontFamily: "Rubik-Medium",
      color: "rgba(255, 255, 255, 0.8)",
      textAlign: "center",
    },
    balanceAmount: {
      fontSize: 32,
      fontFamily: "Rubik-Bold",
      color: "#fff",
      textAlign: "center",
      marginTop: 8,
    },
    balanceRow: {
      flexDirection: "row",
      marginTop: 24,
      gap: 16,
    },
    balanceItem: {
      flex: 1,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 16,
      padding: 16,
      alignItems: "center",
    },
    balanceIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    balanceItemLabel: {
      fontSize: 12,
      fontFamily: "Rubik-Medium",
      color: "rgba(255, 255, 255, 0.8)",
      marginBottom: 4,
    },
    balanceItemAmount: {
      fontSize: 18,
      fontFamily: "Rubik-Bold",
      color: "#fff",
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Rubik-SemiBold",
      color: colors.text,
      marginBottom: 16,
    },
    viewAllButton: {
      fontSize: 14,
      fontFamily: "Rubik-Medium",
      color: colors.primary,
    },
    statsRow: {
      flexDirection: "row",
    },
    statCard: {
      padding: 16,
    },
    statHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    statIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
    },
    statAmount: {
      fontSize: 20,
      fontFamily: "Rubik-Bold",
    },
    quickStatsRow: {
      flexDirection: "row",
      gap: 12,
    },
    quickStatCard: {
      flex: 1,
      padding: 16,
      alignItems: "center",
    },
    quickStatNumber: {
      fontSize: 24,
      fontFamily: "Rubik-Bold",
      color: colors.text,
    },
    quickStatLabel: {
      fontSize: 10,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 4,
    },
    transactionsCard: {
      padding: 0,
    },
    emptyState: {
      padding: 32,
      alignItems: "center",
    },
    emptyStateText: {
      fontSize: 14,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
    },
    transactionItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    transactionLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    transactionDetails: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: 14,
      fontFamily: "Rubik-Medium",
      color: colors.text,
    },
    transactionMeta: {
      fontSize: 12,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      marginTop: 2,
    },
    transactionAmount: {
      fontSize: 14,
      fontFamily: "Rubik-SemiBold",
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
  })
