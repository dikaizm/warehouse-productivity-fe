"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import Header from "@/components/header";

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

  return (
    <html lang="en">
      <body className={inter.className}>
        {pathname !== "/login" && <Header />}
        {children}
      </body>
    </html>
  )
}
