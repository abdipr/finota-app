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
  home: "home",
  airplane: "airplane",
  "musical-notes": "musical-notes",
  "game-controller": "game-controller",
  cafe: "cafe",
  gift: "gift",
  card: "card",
  "phone-portrait": "phone-portrait",
  "car-sport": "car-sport",
  train: "train",
  bicycle: "bicycle",
  pizza: "pizza",
  wine: "wine",
  barbell: "barbell",
  fitness: "fitness",
  library: "library",
  business: "business",
  construct: "construct",
  "color-palette": "color-palette",
  camera: "camera",
  headset: "headset",
  shirt: "shirt",
  cut: "cut",
  hammer: "hammer",
  bulb: "bulb",
}

export function CategoryIcon({ icon, color, size = 20 }: CategoryIconProps) {
  const iconName = iconMap[icon] || "help-circle"

  return <Ionicons name={iconName} size={size} color={color} />
}
