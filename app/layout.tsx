import type React from "react"
import type { Metadata } from "next"
import { Rubik, Geologica } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
})

const geologica = Geologica({
  subsets: ["latin"],
  variable: "--font-geologica",
})

export const metadata: Metadata = {
  title: "Finota - Personal Finance Tracker",
  description: "Modern, elegant finance tracking application with multi-language support",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${rubik.variable} ${geologica.variable} font-rubik antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="finota-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
