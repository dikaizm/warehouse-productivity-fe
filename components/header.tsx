"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, User, LogOut, Warehouse } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ROLES_NAME, STORAGE_KEYS } from "@/lib/constants";
import { useAuth } from "@/context/auth-context";

export default function Header() {
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-yellow-300 p-4 flex w-full justify-between items-center fixed top-0 left-0 z-50">
      <div className="flex items-center gap-3">
        <Warehouse className="w-8 h-8" />
        <div className="font-bold flex flex-col">
          <span className="text-xs">DASHBOARD</span>
          <span>PRODUKTIVITAS GUDANG</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-white">
              <Avatar className="h-8 w-6">
                <AvatarFallback>
                  {user?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-2">
                <p className="font-medium text-lg leading-none">
                  {user?.fullName}
                </p>
                <p className="text-sm leading-none text-muted-foreground">
                  {ROLES_NAME[user?.role as keyof typeof ROLES_NAME]}
                </p>
                <p className="text-sm leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogTrigger asChild className="p-2">
                  <button type="button" className="w-full text-left flex items-center gap-2 text-red-600" onClick={() => setShowLogoutDialog(true)}>
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Yakin ingin keluar?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Anda akan keluar dari aplikasi. Apakah Anda yakin ingin melanjutkan?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">Keluar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 