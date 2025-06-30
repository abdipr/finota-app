"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { useTransactions } from "@/hooks/use-transactions"
import { useCurrency } from "@/hooks/use-currency"
import { useCategories } from "@/hooks/use-categories"
import { CategoryIcon } from "@/components/category-icon"

export default function AddTransaction() {
  const router = useRouter()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.category) return

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

      router.push("/")
    } catch (error) {
      console.error("Error adding transaction:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCategory = categories.find((c) => c.name === formData.category)

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-light-text dark:text-dark-text font-geologica">
              {t("addTransaction.title")}
            </h1>
            <p className="text-sm text-light-secondary dark:text-dark-secondary">{t("addTransaction.subtitle")}</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-geologica">{t("addTransaction.type")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={formData.type === "income" ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, type: "income", category: "" })}
                  className="h-12 flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  {t("addTransaction.income")}
                </Button>
                <Button
                  type="button"
                  variant={formData.type === "expense" ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
                  className="h-12 flex items-center gap-2"
                >
                  <TrendingDown className="h-4 w-4" />
                  {t("addTransaction.expense")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-geologica">{t("addTransaction.details")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">{t("addTransaction.description")}</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t("addTransaction.descriptionPlaceholder")}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{t("addTransaction.amount")}</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                  className="h-12 text-lg font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t("addTransaction.category")}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t("addTransaction.selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center gap-2">
                          <CategoryIcon icon={category.icon} color={category.color} size={16} />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">{t("addTransaction.date")}</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">
                  {t("addTransaction.notes")} ({t("addTransaction.optional")})
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t("addTransaction.notesPlaceholder")}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {formData.amount && selectedCategory && (
            <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-geologica">{t("addTransaction.preview")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full" style={{ backgroundColor: `${selectedCategory.color}20` }}>
                      <CategoryIcon icon={selectedCategory.icon} color={selectedCategory.color} size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-light-text dark:text-dark-text">
                        {formData.description || t("addTransaction.descriptionPlaceholder")}
                      </p>
                      <p className="text-sm text-light-secondary dark:text-dark-secondary">
                        {formData.category || t("addTransaction.selectCategory")}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold" style={{ color: selectedCategory.color }}>
                    {formData.type === "income" ? "+" : "-"}
                    {formatCurrency(Number.parseFloat(formData.amount) || 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading || !formData.description || !formData.amount || !formData.category}
            >
              {isLoading ? t("addTransaction.saving") : t("addTransaction.save")}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
