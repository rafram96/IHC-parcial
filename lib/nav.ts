import {
  CalendarDaysIcon,
  FileSignatureIcon,
  HomeIcon,
  ScaleIcon,
} from "lucide-react"

export const navItems = [
  { title: "Inicio", href: "/", icon: HomeIcon },
  { title: "Casos", href: "/casos", icon: ScaleIcon },
  { title: "Actuaciones notariales", href: "/actuaciones", icon: FileSignatureIcon },
  { title: "Agenda", href: "/agenda", icon: CalendarDaysIcon },
]

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}
