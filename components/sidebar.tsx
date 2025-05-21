"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { PlusIcon } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const links = [
    { name: "Overview", href: "/" },
    { name: "Daily Log", href: "/daily-logs" },
    { name: "Insights", href: "/insights" },
    { name: "Top Performers", href: "/top-performers" },
    { name: "Reports", href: "/reports" },
    { name: "Settings", href: "/settings" },
  ]

  return (
    <aside className="w-48 bg-gray-100 pl-4 pr-4 pt-24 pb-4 fixed h-full top-0 left-0 z-20">
      <Button variant="outline" className={`w-full bg-blue-500 text-white ${pathname === "/daily-logs/input" ? "bg-white text-black" : ""}`} onClick={() => router.push("/daily-logs/input")}><PlusIcon className="w-4 h-4" /> Input Form</Button>

      <nav className="mt-4">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "block px-4 py-2 rounded-md text-sm",
              pathname === link.href ? "bg-gray-200 font-bold" : "hover:bg-gray-200",
            )}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
