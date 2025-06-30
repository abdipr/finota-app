import { Ionicons } from "@expo/vector-icons"

interface CategoryIconProps {
  icon: string
  color: string
  size?: number
}

const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  restaurant: "restaurant",
  car: "car",
  bag: "bag",
  receipt: "receipt",
  film: "film",
  medical: "medical",
  school: "school",
  briefcase: "briefcase",
  laptop: "laptop",
  "trending-up": "trending-up",
  "help-circle": "help-circle",
}

export function CategoryIcon({ icon, color, size = 20 }: CategoryIconProps) {
  const iconName = iconMap[icon] || "help-circle"

  return <Ionicons name={iconName} size={size} color={color} />
}
