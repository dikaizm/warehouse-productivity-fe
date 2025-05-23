"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { AuthProvider } from "@/context/auth-context";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken && pathname !== "/login") {
      router.push("/login");
    }
  }, [pathname, router]);

  const showLayout = pathname !== "/login";

  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${inter.className} flex flex-col max-h-screen text-black`}>
          {showLayout && <Header />}
          <div className="flex flex-1">
            {showLayout && <Sidebar />}
            <main className={`flex-1 ${showLayout ? "ml-48 pt-24" : ""} relative overflow-y-auto ${showLayout ? "p-6 bg-gray-50" : ""}`}>
              {children}
            </main>
          </div>
        </body>
      </AuthProvider>
    </html>
  )
}
