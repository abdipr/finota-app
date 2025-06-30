"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useTheme } from "../../contexts/ThemeContext"
import { useTranslation } from "../../contexts/TranslationContext"
import { useCurrency } from "../../contexts/CurrencyContext"
import { Card } from "../../components/Card"

export default function Profile() {
  const router = useRouter()
  const { colors, isDark, theme, setTheme } = useTheme()
  const { t, language, setLanguage } = useTranslation()
  const { currency, setCurrency, currencies } = useCurrency()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleThemeChange = () => {
    Alert.alert("Select Theme", "Choose your preferred theme", [
      { text: "Light", onPress: () => setTheme("light") },
      { text: "Dark", onPress: () => setTheme("dark") },
      { text: "System", onPress: () => setTheme("system") },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const handleLanguageChange = () => {
    Alert.alert("Select Language", "Choose your preferred language", [
      { text: "English", onPress: () => setLanguage("en") },
      { text: "Bahasa Indonesia", onPress: () => setLanguage("id") },
      { text: "Español", onPress: () => setLanguage("es") },
      { text: "Français", onPress: () => setLanguage("fr") },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const handleCurrencyChange = () => {
    Alert.alert("Select Currency", "Choose your preferred currency", [
      ...currencies.slice(0, 5).map((curr) => ({
        text: `${curr.symbol} ${curr.code}`,
        onPress: () => setCurrency(curr.code),
      })),
      { text: "Cancel", style: "cancel" },
    ])
  }

  const getThemeDisplayName = () => {
    switch (theme) {
      case "light":
        return "Light Mode"
      case "dark":
        return "Dark Mode"
      case "system":
        return "System Default"
      default:
        return "System Default"
    }
  }

  const getLanguageDisplayName = () => {
    switch (language) {
      case "en":
        return "English"
      case "id":
        return "Bahasa Indonesia"
      case "es":
        return "Español"
      case "fr":
        return "Français"
      default:
        return "English"
    }
  }

  const getCurrentCurrency = () => {
    const curr = currencies.find((c) => c.code === currency)
    return curr ? `${curr.symbol} ${curr.name}` : "USD"
  }

  const styles = createStyles(colors, isDark)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Customize your app experience</Text>
        </View>

        {/* Appearance Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <Card>
            <TouchableOpacity style={styles.settingItem} onPress={handleThemeChange}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="color-palette" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Theme</Text>
                  <Text style={styles.settingValue}>{getThemeDisplayName()}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Language & Region */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language & Region</Text>
          <Card>
            <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="language" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Language</Text>
                  <Text style={styles.settingValue}>{getLanguageDisplayName()}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.settingItem} onPress={handleCurrencyChange}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="card" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Currency</Text>
                  <Text style={styles.settingValue}>{getCurrentCurrency()}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Card>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Developer</Text>
              <Text style={styles.infoValue}>Finota Team</Text>
            </View>
          </Card>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.supportButton}>
            <Ionicons name="heart" size={20} color={colors.primary} />
            <Text style={styles.supportButtonText}>Support Developer</Text>
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
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Rubik-SemiBold",
      color: colors.text,
      marginBottom: 12,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    settingTitle: {
      fontSize: 16,
      fontFamily: "Rubik-Medium",
      color: colors.text,
    },
    settingValue: {
      fontSize: 14,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
      marginTop: 2,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    infoLabel: {
      fontSize: 14,
      fontFamily: "Rubik-Regular",
      color: colors.textSecondary,
    },
    infoValue: {
      fontSize: 14,
      fontFamily: "Rubik-Medium",
      color: colors.text,
    },
    supportButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: "transparent",
    },
    supportButtonText: {
      fontSize: 16,
      fontFamily: "Rubik-Medium",
      color: colors.primary,
      marginLeft: 8,
    },
  })
