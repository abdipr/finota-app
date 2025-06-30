import { registerRootComponent } from "expo"
import { ExpoRoot } from "expo-router"

// Must be exported or React Native will warn about it not being registered
export default function App() {
  const ctx = require.context("./app")
  return <ExpoRoot context={ctx} />
}

registerRootComponent(App)
