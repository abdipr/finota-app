"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import { useTranslation } from "../../contexts/TranslationContext"
import { Card } from "../../components/Card"

interface Reminder {
  id: string
  title: string
  message: string
  time: string
  frequency: "daily" | "weekly" | "monthly"
  isActive: boolean
}

export default function Reminders() {
  const { colors, isDark } = useTheme()
  const { t } = useTranslation()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load sample reminders
    setReminders([
      {
        id: "1",
        title: "Pay Rent",
        message: "Don't forget to pay monthly rent",
        time: "09:00",
        frequency: "monthly",
        isActive: true,
      },
      {
        id: "2",
        title: "Check Expenses",
        message: "Review daily expenses",
        time: "20:00",
        frequency: "daily",
        isActive: true,
      },
    ])
  }, [])

  if (!mounted) {
    return null
  }

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === id ? { ...reminder, isActive: !reminder.isActive } : reminder)),
    )
  }

  const deleteReminder = (id: string) => {
    Alert.alert("Delete Reminder", "Are you sure you want to delete this reminder?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setReminders((prev) => prev.filter((r) => r.id !== id)),
      },
    ])
  }

  const styles = createStyles(colors, isDark)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Reminders</Text>
            <Text style={styles.subtitle}>Manage your financial reminders</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Reminders List */}
        <View style={styles.section}>
          {reminders.length === 0 ? (
            <Card>
              <View style={styles.emptyState}>
                <Ionicons name="notifications-off" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>No reminders yet</Text>
                <Text style={styles.emptyStateSubtext}>Add reminders to stay on top of your finances</Text>
              </View>
            </Card>
          ) : (
            reminders.map((reminder) => (
              <Card key={reminder.id} style={styles.reminderCard}>
                <View style={styles.reminderHeader}>
                  <View style={styles.reminderLeft}>
                    <View style={styles.reminderIcon}>
                      <Ionicons name="notifications" size={16} color={colors.primary} />
                    </View>
                    <View style={styles.reminderContent}>
                      <Text style={styles.reminderTitle}>{reminder.title}</Text>
                      <Text style={styles.reminderMessage}>{reminder.message}</Text>
                      <View style={styles.reminderMeta}>
                        <View style={styles.reminderTime}>
                          <Ionicons name="time" size={12} color={colors.textSecondary} />
                          <Text style={styles.reminderTimeText}>{reminder.time}</Text>
                        </View>
                        <Text style={styles.reminderFrequency}>
                          {reminder.frequency.charAt(0).toUpperCase() + reminder.frequency.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.reminderActions}>
                    <TouchableOpacity
                      style={[styles.toggleButton, reminder.isActive && styles.toggleButtonActive]}
                      onPress={() => toggleReminder(reminder.id)}
                    >
                      <View style={[styles.toggleSlider, reminder.isActive && styles.toggleSliderActive]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteReminder(reminder.id)}>
                      <Ionicons name="trash" size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Add Reminder Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.addReminderButton}>
            <Ionicons name="add-circle" size={20} color={colors.primary} />
            <Text style={styles.addReminderText}>Add New Reminder</Text>
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
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    headerLeft: {
      flex: 1,
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
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyStateText: {
      fontSize: 16,
      fontFamily: "Rubik-Medium",
      color: colors.text,
      marginTop: 16,
    },
    emptyStateSubtext: {
      fontSize: 14,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 8,
    },
    reminderCard: {
      marginBottom: 12,
    },
    reminderHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    reminderLeft: {
      flexDirection: "row",
      flex: 1,
    },
    reminderIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    reminderContent: {
      flex: 1,
    },
    reminderTitle: {
      fontSize: 16,
      fontFamily: "Rubik-SemiBold",
      color: colors.text,
    },
    reminderMessage: {
      fontSize: 14,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      marginTop: 4,
    },
    reminderMeta: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    reminderTime: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 16,
    },
    reminderTimeText: {
      fontSize: 12,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      marginLeft: 4,
    },
    reminderFrequency: {
      fontSize: 12,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      textTransform: "capitalize",
    },
    reminderActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    toggleButton: {
      width: 44,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.border,
      justifyContent: "center",
      paddingHorizontal: 2,
    },
    toggleButtonActive: {
      backgroundColor: colors.primary,
    },
    toggleSlider: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#fff",
      alignSelf: "flex-start",
    },
    toggleSliderActive: {
      alignSelf: "flex-end",
    },
    deleteButton: {
      padding: 4,
    },
    addReminderButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.primary,
      borderStyle: "dashed",
    },
    addReminderText: {
      fontSize: 14,
      fontFamily: "Rubik-Medium",
      color: colors.primary,
      marginLeft: 8,
    },
  })
