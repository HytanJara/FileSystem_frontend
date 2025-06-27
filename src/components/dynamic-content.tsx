"use client"

import { useNavigation } from "@/contexts/navigation-context"
import { MainContent } from "./main-content"
import { SharedContent } from "./shared-content"
import { TrashContent } from "./trash-content"

export function DynamicContent() {
  const { currentView } = useNavigation()

  switch (currentView) {
    case "my-drive":
      return <MainContent />
    case "shared":
      return <SharedContent />
    case "trash":
      return <TrashContent />
    default:
      return <MainContent />
  }
}
