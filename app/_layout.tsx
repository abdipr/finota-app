"use client"

import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useColorScheme } from "react-native"
import { ThemeProvider } from "../contexts/ThemeContext"
import { TranslationProvider } from "../contexts/TranslationContext"
import { CurrencyProvider } from "../contexts/CurrencyContext"
import { TransactionProvider } from "../contexts/TransactionContext"
import { CategoryProvider } from "../contexts/CategoryContext"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const [fontsLoaded] = useFonts({
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <ThemeProvider>
      <TranslationProvider>
        <CurrencyProvider>
          <CategoryProvider>
            <TransactionProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="add-transaction" />
                <Stack.Screen name="transactions" />
                <Stack.Screen name="settings" />
              </Stack>
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            </TransactionProvider>
          </CategoryProvider>
        </CurrencyProvider>
      </TranslationProvider>
    </ThemeProvider>
  )
}
