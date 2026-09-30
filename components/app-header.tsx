"use client"

import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { isActivePath, navItems } from "@/lib/nav"

export function AppHeader() {
  const pathname = usePathname()
  const current = navItems.find((item) => isActivePath(pathname, item.href))

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="text-lg font-semibold">{current?.title}</h1>
    </header>
  )
}
