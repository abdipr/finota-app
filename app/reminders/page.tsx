"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Bell, Clock, Trash2, Play, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTranslation } from "@/hooks/use-translation"
import { BottomNavigation } from "@/components/bottom-navigation"

interface Reminder {
  id: string
  title: string
  message: string
  time: string
  frequency: "daily" | "weekly" | "monthly" | "custom"
  isActive: boolean
  customDays?: string[] // for custom day selection
}

export default function Reminders() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    time: "09:00",
    frequency: "daily" as "daily" | "weekly" | "monthly" | "custom",
    customDays: [] as string[],
  })

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("finota-reminders")
    if (saved) {
      try {
        setReminders(JSON.parse(saved))
      } catch {
        setReminders([])
      }
    }
  }, [])

  const saveReminders = (newReminders: Reminder[]) => {
    setReminders(newReminders)
    localStorage.setItem("finota-reminders", JSON.stringify(newReminders))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      time: "09:00",
      frequency: "daily",
      customDays: [],
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.message) return

    if (editingReminder) {
      // Update existing reminder
      const updatedReminders = reminders.map((r) =>
        r.id === editingReminder.id
          ? {
              ...r,
              title: formData.title,
              message: formData.message,
              time: formData.time,
              frequency: formData.frequency,
              customDays: formData.frequency === "custom" ? formData.customDays : undefined,
            }
          : r,
      )
      saveReminders(updatedReminders)
      setEditingReminder(null)
    } else {
      // Add new reminder
      const newReminder: Reminder = {
        id: Date.now().toString(),
        title: formData.title,
        message: formData.message,
        time: formData.time,
        frequency: formData.frequency,
        isActive: true,
        customDays: formData.frequency === "custom" ? formData.customDays : undefined,
      }
      saveReminders([...reminders, newReminder])
      setShowAddForm(false)
    }

    resetForm()
  }

  const startEdit = (reminder: Reminder) => {
    setEditingReminder(reminder)
    setFormData({
      title: reminder.title,
      message: reminder.message,
      time: reminder.time,
      frequency: reminder.frequency,
      customDays: reminder.customDays || [],
    })
  }

  const toggleReminder = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    saveReminders(updated)
  }

  const deleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id)
    saveReminders(updated)
  }

  const testNotification = async (reminder: Reminder) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(reminder.title, {
          body: reminder.message,
          icon: "/favicon.ico",
        })
      } else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
          new Notification(reminder.title, {
            body: reminder.message,
            icon: "/favicon.ico",
          })
        }
      }
    }
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }
  }

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  if (!mounted) {
    return null
  }

  const weekDays = [
    { value: "monday", label: t("reminders.monday") },
    { value: "tuesday", label: t("reminders.tuesday") },
    { value: "wednesday", label: t("reminders.wednesday") },
    { value: "thursday", label: t("reminders.thursday") },
    { value: "friday", label: t("reminders.friday") },
    { value: "saturday", label: t("reminders.saturday") },
    { value: "sunday", label: t("reminders.sunday") },
  ]

  const getFrequencyDisplay = (reminder: Reminder) => {
    if (reminder.frequency === "custom" && reminder.customDays) {
      return reminder.customDays.map((d) => t(`reminders.${d}`)).join(", ")
    }
    return t(`reminders.${reminder.frequency}`)
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-light-text dark:text-dark-text font-geologica">
                {t("reminders.title")}
              </h1>
              <p className="text-sm text-light-secondary dark:text-dark-secondary">{t("reminders.subtitle")}</p>
            </div>
            <Button onClick={() => setShowAddForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t("reminders.add")}
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <Card className="bg-light-card dark:bg-dark-card border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-light-secondary dark:text-dark-secondary mx-auto mb-4" />
                <p className="text-light-secondary dark:text-dark-secondary">{t("reminders.noReminders")}</p>
              </CardContent>
            </Card>
          ) : (
            reminders.map((reminder) => (
              <Card key={reminder.id} className="bg-light-card dark:bg-dark-card border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-light-text dark:text-dark-text">{reminder.title}</h3>
                      </div>
                      <p className="text-sm text-light-secondary dark:text-dark-secondary mb-2">{reminder.message}</p>
                      <div className="flex items-center gap-4 text-xs text-light-secondary dark:text-dark-secondary">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {reminder.time}
                        </div>
                        <span className="capitalize">{getFrequencyDisplay(reminder)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => testNotification(reminder)}
                        className="h-8 w-8"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => startEdit(reminder)} className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Switch checked={reminder.isActive} onCheckedChange={() => toggleReminder(reminder.id)} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReminder(reminder.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Add Reminder Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="bg-light-card dark:bg-dark-card max-w-md">
          <DialogHeader>
            <DialogTitle>{t("reminders.addNew")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("reminders.title")}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t("reminders.titlePlaceholder")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t("reminders.message")}</Label>
              <Input
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t("reminders.messagePlaceholder")}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">{t("reminders.time")}</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">{t("reminders.frequency")}</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: "daily" | "weekly" | "monthly" | "custom") =>
                    setFormData({ ...formData, frequency: value, customDays: [] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t("reminders.daily")}</SelectItem>
                    <SelectItem value="weekly">{t("reminders.weekly")}</SelectItem>
                    <SelectItem value="monthly">{t("reminders.monthly")}</SelectItem>
                    <SelectItem value="custom">{t("reminders.customDays")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.frequency === "custom" && (
              <div className="space-y-2">
                <Label>{t("reminders.selectDays")}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {weekDays.map((day) => (
                    <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.customDays.includes(day.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, customDays: [...formData.customDays, day.value] })
                          } else {
                            setFormData({ ...formData, customDays: formData.customDays.filter((d) => d !== day.value) })
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">
                {t("reminders.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  resetForm()
                }}
                className="flex-1"
              >
                {t("reminders.cancel")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Reminder Dialog */}
      <Dialog open={!!editingReminder} onOpenChange={() => setEditingReminder(null)}>
        <DialogContent className="bg-light-card dark:bg-dark-card max-w-md">
          <DialogHeader>
            <DialogTitle>{t("reminders.editReminder")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editTitle">{t("reminders.title")}</Label>
              <Input
                id="editTitle"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t("reminders.titlePlaceholder")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editMessage">{t("reminders.message")}</Label>
              <Input
                id="editMessage"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t("reminders.messagePlaceholder")}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editTime">{t("reminders.time")}</Label>
                <Input
                  id="editTime"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editFrequency">{t("reminders.frequency")}</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: "daily" | "weekly" | "monthly" | "custom") =>
                    setFormData({ ...formData, frequency: value, customDays: [] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t("reminders.daily")}</SelectItem>
                    <SelectItem value="weekly">{t("reminders.weekly")}</SelectItem>
                    <SelectItem value="monthly">{t("reminders.monthly")}</SelectItem>
                    <SelectItem value="custom">{t("reminders.customDays")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.frequency === "custom" && (
              <div className="space-y-2">
                <Label>{t("reminders.selectDays")}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {weekDays.map((day) => (
                    <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.customDays.includes(day.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, customDays: [...formData.customDays, day.value] })
                          } else {
                            setFormData({ ...formData, customDays: formData.customDays.filter((d) => d !== day.value) })
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">
                {t("reminders.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingReminder(null)
                  resetForm()
                }}
                className="flex-1"
              >
                {t("reminders.cancel")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  )
}
