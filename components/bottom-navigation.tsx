"use client"

import { Home, BarChart3, Plus, Bell, User } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"

export function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation()

  const navItems = [
    {
      icon: Home,
      label: t("nav.dashboard"),
      path: "/",
      isActive: pathname === "/",
    },
    {
      icon: BarChart3,
      label: t("nav.statistics"),
      path: "/statistics",
      isActive: pathname === "/statistics",
    },
    {
      icon: Plus,
      label: t("nav.add"),
      path: "/add-transaction",
      isActive: false,
      isCenter: true,
    },
    {
      icon: Bell,
      label: t("nav.reminders"),
      path: "/reminders",
      isActive: pathname === "/reminders",
    },
    {
      icon: User,
      label: t("nav.profile"),
      path: "/personalization",
      isActive: pathname === "/personalization",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-light-card/95 dark:bg-dark-card/95 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-800/50">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map((item, index) => {
          if (item.isCenter) {
            return (
              <Button
                key={index}
                onClick={() => router.push(item.path)}
                className="h-14 w-14 rounded-full bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="icon"
              >
                <item.icon className="h-6 w-6" />
              </Button>
            )
          }

          return (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center p-2 min-w-[60px] rounded-lg transition-colors ${
                item.isActive
                  ? "text-primary bg-primary/10"
                  : "text-light-secondary dark:text-dark-secondary hover:text-light-text dark:hover:text-dark-text"
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
