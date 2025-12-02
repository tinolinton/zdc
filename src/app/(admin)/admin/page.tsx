import Link from "next/link";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserPlus,
  FileQuestion,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  Clock4,
} from "lucide-react";

async function getStats() {
  try {
    const cookieHeader = (await cookies()).toString();
    const base =
      process.env.NEXTAUTH_URL ??
      process.env.AUTH_URL ??
      "http://localhost:3000";
    const res = await fetch(new URL("/api/admin/stats", base).toString(), {
      cache: "no-store",
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });
    if (!res.ok) {
      throw new Error("Failed to load admin stats");
    }
    return (await res.json()) as {
      totalUsers: number;
      newUsers7d: number;
      questionCount: number;
      totalTests: number;
      testsToday: number;
      passRate: number;
      failRate: number;
      avgScore: number;
      activeUsers7d: number;
    };
  } catch {
    return {
      totalUsers: 0,
      newUsers7d: 0,
      questionCount: 0,
      totalTests: 0,
      testsToday: 0,
      passRate: 0,
      failRate: 0,
      avgScore: 0,
      activeUsers7d: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: "All registered users",
      href: "/admin/users",
    },
    {
      title: "New Users (7d)",
      value: stats.newUsers7d.toLocaleString(),
      icon: UserPlus,
      description: "Joined in the last 7 days",
      href: "/admin/users",
    },
    {
      title: "Active Questions",
      value: stats.questionCount.toLocaleString(),
      icon: FileQuestion,
      description: "Questions in the bank",
      href: "/admin/questions",
    },
    {
      title: "Active Users (7d)",
      value: stats.activeUsers7d.toLocaleString(),
      icon: Activity,
      description: "Users who attempted tests",
      href: "/admin/users",
    },
    {
      title: "Tests Today",
      value: stats.testsToday.toLocaleString(),
      icon: Clock4,
      description: "Attempts made today",
      href: "/admin/tests",
    },
    {
      title: "Total Tests",
      value: stats.totalTests.toLocaleString(),
      icon: BarChart3,
      description: "All recorded attempts",
      href: "/admin/tests",
    },
    {
      title: "Pass Rate",
      value: `${stats.passRate.toFixed(1)}%`,
      icon: CheckCircle,
      description: "Passes across all tests",
      href: "/admin/tests",
    },
    {
      title: "Fail Rate",
      value: `${stats.failRate.toFixed(1)}%`,
      icon: XCircle,
      description: "Fails across all tests",
      href: "/admin/tests",
    },
    {
      title: "Average Score",
      value: stats.avgScore ? stats.avgScore.toFixed(1) : "0.0",
      icon: BarChart3,
      description: "Across all attempts",
      href: "/admin/tests",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat) => (
          <Link key={stat.title} href={stat.href ?? "#"} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
