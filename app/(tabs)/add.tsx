"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useTheme } from "../../contexts/ThemeContext"
import { useTranslation } from "../../contexts/TranslationContext"
import { useTransactions } from "../../contexts/TransactionContext"
import { useCurrency } from "../../contexts/CurrencyContext"
import { useCategories } from "../../contexts/CategoryContext"
import { Card } from "../../components/Card"
import { CategoryIcon } from "../../components/CategoryIcon"

export default function AddTransaction() {
  const router = useRouter()
  const { colors, isDark } = useTheme()
  const { t } = useTranslation()
  const { addTransaction } = useTransactions()
  const { formatCurrency } = useCurrency()
  const { categories } = useCategories()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    description: "",
    amount: "",
    category: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  })

  const filteredCategories = categories.filter((c) => c.type === formData.type)

  const handleSubmit = async () => {
    if (!formData.description || !formData.amount || !formData.category) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      await addTransaction({
        description: formData.description,
        amount: Number.parseFloat(formData.amount),
        category: formData.category,
        type: formData.type,
        notes: formData.notes,
        date: formData.date,
      })

      router.back()
    } catch (error) {
      console.error("Error adding transaction:", error)
      Alert.alert("Error", "Failed to add transaction")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCategory = categories.find((c) => c.name === formData.category)

  const styles = createStyles(colors, isDark)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{t("addTransaction.title")}</Text>
            <Text style={styles.subtitle}>{t("addTransaction.subtitle")}</Text>
          </View>
        </View>

        {/* Transaction Type */}
        <View style={styles.section}>
          <Card>
            <Text style={styles.sectionTitle}>{t("addTransaction.type")}</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[styles.typeButton, formData.type === "income" && styles.typeButtonActive]}
                onPress={() => setFormData({ ...formData, type: "income", category: "" })}
              >
                <Ionicons name="trending-up" size={20} color={formData.type === "income" ? "#fff" : colors.primary} />
                <Text style={[styles.typeButtonText, formData.type === "income" && styles.typeButtonTextActive]}>
                  {t("addTransaction.income")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, formData.type === "expense" && styles.typeButtonActive]}
                onPress={() => setFormData({ ...formData, type: "expense", category: "" })}
              >
                <Ionicons
                  name="trending-down"
                  size={20}
                  color={formData.type === "expense" ? "#fff" : colors.primary}
                />
                <Text style={[styles.typeButtonText, formData.type === "expense" && styles.typeButtonTextActive]}>
                  {t("addTransaction.expense")}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Form Fields */}
        <View style={styles.section}>
          <Card>
            <Text style={styles.sectionTitle}>Transaction Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t("addTransaction.description")}</Text>
              <TextInput
                style={styles.textInput}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Enter description"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t("addTransaction.amount")}</Text>
              <TextInput
                style={styles.textInput}
                value={formData.amount}
                onChangeText={(text) => setFormData({ ...formData, amount: text })}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t("addTransaction.category")}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {filteredCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryItem, formData.category === category.name && styles.categoryItemActive]}
                    onPress={() => setFormData({ ...formData, category: category.name })}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: category.color + "20" },
                        formData.category === category.name && { backgroundColor: category.color },
                      ]}
                    >
                      <CategoryIcon
                        icon={category.icon}
                        color={formData.category === category.name ? "#fff" : category.color}
                        size={20}
                      />
                    </View>
                    <Text
                      style={[styles.categoryText, formData.category === category.name && styles.categoryTextActive]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t("addTransaction.notes")}</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Add notes (optional)"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
          </Card>
        </View>

        {/* Preview */}
        {formData.amount && selectedCategory && (
          <View style={styles.section}>
            <Card>
              <Text style={styles.sectionTitle}>Preview</Text>
              <View style={styles.previewItem}>
                <View style={styles.previewLeft}>
                  <View style={[styles.previewIcon, { backgroundColor: selectedCategory.color + "20" }]}>
                    <CategoryIcon icon={selectedCategory.icon} color={selectedCategory.color} size={20} />
                  </View>
                  <View>
                    <Text style={styles.previewDescription}>{formData.description || "Enter description"}</Text>
                    <Text style={styles.previewCategory}>{formData.category}</Text>
                  </View>
                </View>
                <Text style={[styles.previewAmount, { color: selectedCategory.color }]}>
                  {formData.type === "income" ? "+" : "-"}
                  {formatCurrency(Number.parseFloat(formData.amount) || 0)}
                </Text>
              </View>
            </Card>
          </View>
        )}

        {/* Submit Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!formData.description || !formData.amount || !formData.category || isLoading) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!formData.description || !formData.amount || !formData.category || isLoading}
          >
            <Text style={styles.submitButtonText}>{isLoading ? "Saving..." : t("addTransaction.save")}</Text>
          </TouchableOpacity>
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
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    backButton: {
      marginRight: 12,
    },
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontFamily: "Rubik-Bold",
      color: colors.text,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      marginTop: 2,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: "Rubik-SemiBold",
      color: colors.text,
      marginBottom: 16,
    },
    typeButtons: {
      flexDirection: "row",
      gap: 12,
    },
    typeButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: "transparent",
    },
    typeButtonActive: {
      backgroundColor: colors.primary,
    },
    typeButtonText: {
      fontSize: 14,
      fontFamily: "Rubik-Medium",
      color: colors.primary,
      marginLeft: 8,
    },
    typeButtonTextActive: {
      color: "#fff",
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontFamily: "Rubik-Medium",
      color: colors.text,
      marginBottom: 8,
    },
    textInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      fontFamily: "Rubik-Regular",
      color: colors.text,
      backgroundColor: colors.card,
    },
    textArea: {
      height: 80,
      textAlignVertical: "top",
    },
    categoryScroll: {
      marginTop: 8,
    },
    categoryItem: {
      alignItems: "center",
      marginRight: 16,
      paddingVertical: 8,
    },
    categoryItemActive: {
      // Add active styles if needed
    },
    categoryIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    categoryText: {
      fontSize: 12,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      textAlign: "center",
    },
    categoryTextActive: {
      color: colors.text,
      fontFamily: "Rubik-Medium",
    },
    previewItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: colors.background + "50",
      borderRadius: 12,
    },
    previewLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    previewIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    previewDescription: {
      fontSize: 14,
      fontFamily: "Rubik-Medium",
      color: colors.text,
    },
    previewCategory: {
      fontSize: 12,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      marginTop: 2,
    },
    previewAmount: {
      fontSize: 16,
      fontFamily: "Rubik-SemiBold",
    },
    submitButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    submitButtonDisabled: {
      backgroundColor: colors.textSecondary,
      opacity: 0.5,
    },
    submitButtonText: {
      fontSize: 16,
      fontFamily: "Rubik-SemiBold",
      color: "#fff",
    },
  })
