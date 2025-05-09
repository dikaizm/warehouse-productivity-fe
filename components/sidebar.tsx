"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { name: "Overview", href: "/" },
    { name: "Daily Log", href: "/daily-log" },
    { name: "Insights", href: "/insights" },
    { name: "Input Form", href: "/input-form" },
    { name: "Activity Log", href: "/activity-log" },
    { name: "Top Performers", href: "/top-performers" },
    { name: "Reports", href: "/reports" },
    { name: "Settings", href: "/settings" },
  ]

  return (
    <aside className="w-48 bg-gray-100 p-4">
      <nav className="space-y-1">
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
