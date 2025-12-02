import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { Award, Settings as SettingsIcon } from "lucide-react";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  earned: boolean;
};

async function getAchievements(): Promise<Achievement[]> {
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/site/achievements`, {
    cache: "no-store",
  }).catch(() => null);
  if (!res?.ok) return [];
  const data = (await res.json()) as { achievements: Achievement[] };
  return data.achievements ?? [];
}

export default async function ProfilePage() {
  const session = await auth();
  const achievements = await getAchievements();

  return (
    <div className="container mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                defaultValue={session?.user?.name ?? ""}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={session?.user?.email ?? ""}
                placeholder="you@example.com"
              />
            </div>
            <Button className="w-full">Save profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input id="password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input id="confirm" type="password" />
            </div>
            <Button className="w-full" variant="outline">
              Update password
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-3">
          <Award className="h-6 w-6 text-primary" />
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {achievements.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No achievements yet. Pass tests to unlock badges.
            </div>
          ) : (
            achievements.map((ach) => (
              <div
                key={ach.id}
                className={`rounded-lg border p-4 ${
                  ach.earned ? "border-primary" : "border-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{ach.title}</p>
                  {ach.earned ? (
                    <span className="text-xs text-green-600">Earned</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Locked</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{ach.description}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
