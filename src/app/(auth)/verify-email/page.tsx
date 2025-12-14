"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function VerifyEmailPage() {
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
            <div className="flex justify-center my-4">
              <div className="rounded-full bg-accent-emerald/20 p-4 ring-1 ring-accent-emerald/40 shadow-lg shadow-accent-emerald/10 animate-bounce">
                <MailCheck className="h-8 w-8 text-accent-emerald" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <CardTitle className="text-xl font-bold tracking-tight">
                Check your email
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                We&apos;ve sent you a verification link
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button
                variant="outline"
                className="w-full bg-background/50 border-white/10 hover:bg-background/70"
              >
                Resend verification email
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Wrong email?{" "}
                <Link
                  href="/profile"
                  className="font-medium text-primary hover:underline underline-offset-4"
                >
                  Update account
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
