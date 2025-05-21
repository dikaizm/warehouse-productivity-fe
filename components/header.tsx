"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, User, LogOut } from "lucide-react";
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

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{
    username: string;
    fullName: string;
    role: string;
    email: string;
  } | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  return (
    <header className="bg-yellow-300 p-4 flex w-full justify-between items-center fixed top-0 left-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-black"></div>
        <span className="font-bold">LOGO</span>
      </div>
      <div className="flex items-center gap-2">
        {/* <Button variant="outline" size="icon" className="rounded-full bg-white">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full bg-white">
          <Bell className="h-4 w-4" />
        </Button> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-white">
              <Avatar className="h-6 w-6">
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
                  {user?.role}
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