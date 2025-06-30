"use client"

import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface CategoryIconProps {
  icon: string
  color: string
  size?: number
  className?: string
}

export function CategoryIcon({ icon, color, size = 20, className = "" }: CategoryIconProps) {
  const IconComponent = Icons[icon as keyof typeof Icons] as LucideIcon

  if (!IconComponent) {
    const FallbackIcon = Icons.Circle
    return <FallbackIcon size={size} style={{ color }} className={className} />
  }

  return <IconComponent size={size} style={{ color }} className={className} />
}
