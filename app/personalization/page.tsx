"use client"

import { useState, useEffect } from "react"
import { User, Palette, Globe, DollarSign, Tags, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { useTranslation } from "@/hooks/use-translation"
import { useCurrency } from "@/hooks/use-currency"
import { useCategories, type Category } from "@/hooks/use-categories"
import { CategoryIcon } from "@/components/category-icon"
import { BottomNavigation } from "@/components/bottom-navigation"

const colorPalette = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#0ea5e9", // sky
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#f43f5e", // rose
]

const availableIcons = [
  "utensils",
  "car",
  "shopping-bag",
  "file-text",
  "film",
  "heart",
  "book",
  "briefcase",
  "laptop",
  "trending-up",
  "home",
  "plane",
  "music",
  "gamepad-2",
  "coffee",
  "gift",
  "credit-card",
  "smartphone",
  "fuel",
  "bus",
  "train",
  "bike",
  "pizza",
  "wine",
  "dumbbell",
  "stethoscope",
  "graduation-cap",
  "building",
  "wrench",
  "palette",
  "camera",
  "headphones",
  "shirt",
  "scissors",
  "hammer",
  "lightbulb",
]

export default function Personalization() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useTranslation()
  const { currency, setCurrency, currencies } = useCurrency()
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()
  const [mounted, setMounted] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    type: "expense" as "income" | "expense",
    icon: "circle",
    color: "#ef4444",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddCategory = () => {
    if (!categoryForm.name) return

    addCategory({
      name: categoryForm.name,
      type: categoryForm.type,
      icon: categoryForm.icon,
      color: categoryForm.color,
    })

    setCategoryForm({ name: "", type: "expense", icon: "circle", color: "#ef4444" })
    setShowAddCategory(false)
  }

  const handleEditCategory = () => {
    if (!editingCategory || !categoryForm.name) return

    updateCategory(editingCategory.id, {
      name: categoryForm.name,
      type: categoryForm.type,
      icon: categoryForm.icon,
      color: categoryForm.color,
    })

    setEditingCategory(null)
    setCategoryForm({ name: "", type: "expense", icon: "circle", color: "#ef4444" })
  }

  const startEdit = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color,
    })
  }

  if (!mounted) {
    return null
  }

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
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text font-geologica">
              {t("personalization.title")}
            </h1>
            <p className="text-sm text-light-secondary dark:text-dark-secondary">{t("personalization.subtitle")}</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Appearance */}
        <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-geologica flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {t("settings.appearance.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-light-text dark:text-dark-text">
                  {t("settings.appearance.theme")}
                </Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((themeOption) => (
                      <SelectItem key={themeOption.value} value={themeOption.value}>
                        {themeOption.label}
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
            <CardTitle className="text-lg font-geologica flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t("settings.language.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-light-text dark:text-dark-text">
                {t("settings.language.language")}
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-light-text dark:text-dark-text">
                {t("settings.language.currency")}
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      <span>
                        {curr.symbol} {curr.name} ({curr.code})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Custom Categories */}
        <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-geologica flex items-center gap-2">
              <Tags className="h-5 w-5" />
              {t("personalization.categories")}
            </CardTitle>
            <Button onClick={() => setShowAddCategory(true)} size="sm" className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              {t("personalization.addCategory")}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full" style={{ backgroundColor: `${category.color}20` }}>
                      <CategoryIcon icon={category.icon} color={category.color} size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-light-text dark:text-dark-text">{category.name}</p>
                      <p className="text-sm text-light-secondary dark:text-dark-secondary capitalize">
                        {t(`personalization.${category.type}`)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(category)} className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCategory(category.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-geologica flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("settings.about.title")}
            </CardTitle>
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

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent className="bg-light-card dark:bg-dark-card max-w-md">
          <DialogHeader>
            <DialogTitle>{t("personalization.addCategory")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">{t("personalization.categoryName")}</Label>
              <Input
                id="categoryName"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder={t("personalization.categoryNamePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryType">{t("personalization.categoryType")}</Label>
              <Select
                value={categoryForm.type}
                onValueChange={(value: "income" | "expense") => setCategoryForm({ ...categoryForm, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">{t("personalization.income")}</SelectItem>
                  <SelectItem value="expense">{t("personalization.expense")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("personalization.categoryIcon")}</Label>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {availableIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setCategoryForm({ ...categoryForm, icon })}
                    className={`p-2 rounded-lg border-2 transition-colors ${
                      categoryForm.icon === icon
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                    }`}
                  >
                    <CategoryIcon icon={icon} color={categoryForm.color} size={20} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("personalization.categoryColor")}</Label>
              <div className="grid grid-cols-8 gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setCategoryForm({ ...categoryForm, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      categoryForm.color === color
                        ? "border-gray-800 dark:border-gray-200 scale-110"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddCategory} className="flex-1">
                {t("personalization.save")}
              </Button>
              <Button variant="outline" onClick={() => setShowAddCategory(false)} className="flex-1">
                {t("personalization.cancel")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="bg-light-card dark:bg-dark-card max-w-md">
          <DialogHeader>
            <DialogTitle>{t("personalization.editCategory")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editCategoryName">{t("personalization.categoryName")}</Label>
              <Input
                id="editCategoryName"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder={t("personalization.categoryNamePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCategoryType">{t("personalization.categoryType")}</Label>
              <Select
                value={categoryForm.type}
                onValueChange={(value: "income" | "expense") => setCategoryForm({ ...categoryForm, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">{t("personalization.income")}</SelectItem>
                  <SelectItem value="expense">{t("personalization.expense")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("personalization.categoryIcon")}</Label>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {availableIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setCategoryForm({ ...categoryForm, icon })}
                    className={`p-2 rounded-lg border-2 transition-colors ${
                      categoryForm.icon === icon
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                    }`}
                  >
                    <CategoryIcon icon={icon} color={categoryForm.color} size={20} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("personalization.categoryColor")}</Label>
              <div className="grid grid-cols-8 gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setCategoryForm({ ...categoryForm, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      categoryForm.color === color
                        ? "border-gray-800 dark:border-gray-200 scale-110"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleEditCategory} className="flex-1">
                {t("personalization.save")}
              </Button>
              <Button variant="outline" onClick={() => setEditingCategory(null)} className="flex-1">
                {t("personalization.cancel")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  )
}
