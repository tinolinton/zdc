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
import Image from "next/image";

export default function RegisterPage() {
  const backgroundUrl =
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2070&auto=format&fit=crop";
  const [showPassword, setShowPassword] = useState(false);

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
                Create Account
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Join ZimDrive Coach today
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="Max"
                    required
                    className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Robinson"
                    required
                    className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10 bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                    required
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
              >
                Create an account
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground glass rounded-md">
                    Or sign up with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-background/50 border-white/10 hover:bg-background/70"
              >
                GitHub
              </Button>
            </div>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
