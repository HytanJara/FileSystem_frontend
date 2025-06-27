import { Header } from "../components/header"
import { Sidebar } from "../components/sidebar"
import { DynamicContent } from "../components/dynamic-content"
import { NavigationProvider } from "../contexts/navigation-context"

export default function HomePage() {
  return (
    <NavigationProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex">
          <Sidebar />
          <DynamicContent />
        </div>
      </div>
    </NavigationProvider>
  )
}