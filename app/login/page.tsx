"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { postLogin } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await postLogin({ usernameOrEmail, password });
      
      if (response.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        login(response.data.user);
        router.push("/");
      } else {
        setError(response.message);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-G25 overflow-hidden flex h-screen">
      <div className="overflow-hidden">
        <img
          className="h-[863px] left-[-148px] top-0 object-cover"
          src="/login-hero.png"
          alt="Warehouse background"
        />
      </div>
      {/* Form Section Container */}
      <div className="relative px-24 left-0 top-0 flex flex-col justify-center items-center gap-11">
        {/* Welcome Text Block */}
        <div className="self-stretch flex flex-col items-center gap-6">
          <div className="self-stretch flex flex-col items-start gap-1">
            <h1 className="self-stretch text-G900 text-4xl font-semibold">
              Selamat datang kembali!
            </h1>
            <div className="self-stretch p-0.5">
              <p className="text-G600 text-base font-normal">
                Masuk untuk mengakses produktivitas gudang
              </p>
            </div>
          </div>
        </div>

        {/* Form Element */}
        <form onSubmit={handleSubmit} className="self-stretch flex flex-col gap-8">
          {/* Input Fields Group */}
          <div className="self-stretch flex flex-col gap-6">
            {/* Email Field */}
            <div className="self-stretch flex flex-col gap-2">
              <Label
                htmlFor="usernameOrEmail"
                className="self-stretch text-G400 text-base font-medium leading-normal"
              >
                Username atau Email
              </Label>
              <Input
                id="usernameOrEmail"
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
                placeholder="Masukkan username atau email Anda"
                className={cn(
                  "h-14 px-5 text-base border-G300 bg-white",
                  "placeholder:text-G500",
                  "focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-0",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              />
            </div>

            {/* Password Field */}
            <div className="self-stretch flex flex-col gap-2">
              <Label
                htmlFor="password"
                className="self-stretch text-G400 text-base font-medium leading-normal"
              >
                Kata Sandi
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Masukkan kata sandi Anda"
                className={cn(
                  "h-14 px-5 text-base border-G300 bg-white",
                  "placeholder:text-G500",
                  "focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-0",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Submit Button Group */}
          <div className="self-stretch">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-blue-600 rounded-lg text-white text-xl font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Memuat..." : "Masuk"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 