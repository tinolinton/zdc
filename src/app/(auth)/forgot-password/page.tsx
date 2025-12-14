"use client";

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
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const backgroundUrl =
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2072&auto=format&fit=crop";

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
              <CardTitle className="text-xl font-bold tracking-tight">
                Forgot Password?
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Enter your email address to reset your password
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
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
              <Button className="w-full font-semibold shadow-lg shadow-primary/20">
                Send reset link
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
              >
                Return to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
