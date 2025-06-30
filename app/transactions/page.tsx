"use client"

import { useState } from "react"
import { ArrowLeft, Search, Edit, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { useCurrency } from "@/hooks/use-currency"
import { useTransactions, type Transaction } from "@/hooks/use-transactions"
import { useCategories } from "@/hooks/use-categories"
import { CategoryIcon } from "@/components/category-icon"

export default function TransactionsPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()
  const { transactions, updateTransaction, deleteTransaction } = useTransactions()
  const { categories, getCategoryByName } = useCategories()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    notes: "",
    date: "",
  })

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory

    return matchesSearch && matchesType && matchesCategory
  })

  const categoryNames = [...new Set(transactions.map((t) => t.category))]

  const groupedTransactions = filteredTransactions.reduce(
    (groups, transaction) => {
      const date = new Date(transaction.date).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(transaction)
      return groups
    },
    {} as Record<string, typeof transactions>,
  )

  const startEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      notes: transaction.notes || "",
      date: transaction.date,
    })
  }

  const handleEdit = () => {
    if (!editingTransaction || !formData.description || !formData.amount || !formData.category) return

    updateTransaction(editingTransaction.id, {
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      notes: formData.notes,
      date: formData.date,
    })

    setEditingTransaction(null)
    setFormData({ description: "", amount: "", category: "", notes: "", date: "" })
  }

  const handleDelete = (id: string) => {
    deleteTransaction(id)
  }

  const filteredCategoriesForEdit = categories.filter((c) => c.type === editingTransaction?.type)

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-light-text dark:text-dark-text font-geologica">
              {t("transactions.title")}
            </h1>
            <p className="text-sm text-light-secondary dark:text-dark-secondary">
              {filteredTransactions.length} {t("transactions.total")}
            </p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Search and Filters */}
        <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md mb-6">
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-light-secondary dark:text-dark-secondary" />
              <Input
                placeholder={t("transactions.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("transactions.allTypes")}</SelectItem>
                  <SelectItem value="income">{t("transactions.income")}</SelectItem>
                  <SelectItem value="expense">{t("transactions.expenses")}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("transactions.allCategories")}</SelectItem>
                  {categoryNames.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <div key={date}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-light-secondary dark:text-dark-secondary">
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <span className="text-sm text-light-secondary dark:text-dark-secondary">
                  {dayTransactions.length} {t("transactions.items")}
                </span>
              </div>

              <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {dayTransactions.map((transaction) => {
                      const category = getCategoryByName(transaction.category)
                      return (
                        <div key={transaction.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className="p-2 rounded-full"
                              style={{ backgroundColor: `${category?.color || "#6b7280"}20` }}
                            >
                              <CategoryIcon
                                icon={category?.icon || "circle"}
                                color={category?.color || "#6b7280"}
                                size={16}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-light-text dark:text-dark-text">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-light-secondary dark:text-dark-secondary">
                                {transaction.category}
                                {transaction.notes && ` • ${transaction.notes}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <p
                              className="font-semibold"
                              style={{
                                color: category?.color || (transaction.type === "income" ? "#22c55e" : "#ef4444"),
                              }}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => startEdit(transaction)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  {t("transactions.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(transaction.id)}
                                  className="text-red-600 dark:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {t("transactions.delete")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <p className="text-light-secondary dark:text-dark-secondary">{t("transactions.noResults")}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Edit Transaction Dialog */}
      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent className="bg-light-card dark:bg-dark-card">
          <DialogHeader>
            <DialogTitle>{t("transactions.editTransaction")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editDescription">{t("addTransaction.description")}</Label>
              <Input
                id="editDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t("addTransaction.descriptionPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editAmount">{t("addTransaction.amount")}</Label>
              <Input
                id="editAmount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCategory">{t("addTransaction.category")}</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("addTransaction.selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategoriesForEdit.map((category) => (
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
              <Label htmlFor="editDate">{t("addTransaction.date")}</Label>
              <Input
                id="editDate"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editNotes">{t("addTransaction.notes")}</Label>
              <Textarea
                id="editNotes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t("addTransaction.notesPlaceholder")}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleEdit} className="flex-1">
                {t("transactions.save")}
              </Button>
              <Button variant="outline" onClick={() => setEditingTransaction(null)} className="flex-1">
                {t("transactions.cancel")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
