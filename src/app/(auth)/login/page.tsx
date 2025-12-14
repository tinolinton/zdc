"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const backgroundUrl =
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop";
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });
    setLoading(false);
    if (!result?.error) {
      router.push("/");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-black/40 backdrop-blur-[2px]" />

      <div className="relative w-full max-w-sm">
        <Card className="glass-card border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="relative h-14 w-14 rounded-xl bg-background/20 p-2 backdrop-blur-md shadow-inner ring-1 ring-white/20">
                <Image
                  src="/logo/lx2.svg"
                  alt="ZimDrive Coach"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>
            <div className="text-center space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Sign in to continue your journey
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="identifier">Email or username</Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="name@example.com"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="pr-10 bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute inset-y-0 right-0 h-full w-9 px-0 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full font-semibold shadow-lg shadow-primary/20"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Login"}
                </Button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground glass rounded-md">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-background/50 border-white/10 hover:bg-background/70"
                >
                  Google
                </Button>
              </div>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
