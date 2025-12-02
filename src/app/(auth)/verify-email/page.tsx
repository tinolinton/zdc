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

export default function VerifyEmailPage() {
  const backgroundUrl =
    "https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600";

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <Card className="mx-auto w-full max-w-md text-center backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MailCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>
              We&apos;ve sent a verification link to your inbox. Click it to
              activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" variant="outline">
              Resend verification email
            </Button>
            <div className="text-sm text-muted-foreground">
              Wrong email address?{" "}
              <Link className="underline" href="/register">
                Update your account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
