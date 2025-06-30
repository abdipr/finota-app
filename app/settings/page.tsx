"use client"

import { ArrowLeft, Check, Globe, Palette, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useTranslation } from "@/hooks/use-translation"
import { useCurrency } from "@/hooks/use-currency"

export default function Settings() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useTranslation()
  const { currency, setCurrency, currencies } = useCurrency()

  const themes = [
    { value: "system", label: t("settings.theme.system") },
    { value: "light", label: t("settings.theme.light") },
    { value: "dark", label: t("settings.theme.dark") },
  ]

  const languages = [
    { value: "en", label: "English" },
    { value: "id", label: "Bahasa Indonesia" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
  ]

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-light-text dark:text-dark-text font-geologica">
              {t("settings.title")}
            </h1>
            <p className="text-sm text-light-secondary dark:text-dark-secondary">{t("settings.subtitle")}</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Appearance */}
        <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-geologica flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {t("settings.appearance.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-light-text dark:text-dark-text">
                  {t("settings.appearance.theme")}
                </label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((themeOption) => (
                      <SelectItem key={themeOption.value} value={themeOption.value}>
                        <div className="flex items-center gap-2">
                          {theme === themeOption.value && <Check className="h-4 w-4" />}
                          {themeOption.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-geologica flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t("settings.language.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-light-text dark:text-dark-text">
                {t("settings.language.language")}
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <div className="flex items-center gap-2">
                        {language === lang.value && <Check className="h-4 w-4" />}
                        {lang.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-light-text dark:text-dark-text">
                {t("settings.language.currency")}
              </label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      <div className="flex items-center gap-2">
                        {currency === curr.code && <Check className="h-4 w-4" />}
                        <span>
                          {curr.symbol} {curr.name} ({curr.code})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-geologica">{t("settings.about.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-light-secondary dark:text-dark-secondary">
                {t("settings.about.version")}
              </span>
              <span className="text-sm font-medium text-light-text dark:text-dark-text">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-light-secondary dark:text-dark-secondary">
                {t("settings.about.developer")}
              </span>
              <span className="text-sm font-medium text-light-text dark:text-dark-text">Finota Team</span>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
          <CardContent className="p-4">
            <Button
              variant="outline"
              className="w-full h-12 bg-transparent"
              onClick={() => window.open("https://github.com/finota-app", "_blank")}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              {t("settings.supportDev")}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
