import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalUsers,
    newUsers7d,
    questionCount,
    totalTests,
    testsToday,
    passCount,
    failCount,
    avgScoreAggregate,
    activeUsersLast7d,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.question.count(),
    prisma.testResult.count(),
    prisma.testResult.count({
      where: { createdAt: { gte: startOfToday } },
    }),
    prisma.testResult.count({
      where: { status: { equals: "PASS", mode: "insensitive" } },
    }),
    prisma.testResult.count({
      where: { status: { equals: "FAIL", mode: "insensitive" } },
    }),
    prisma.testResult.aggregate({
      _avg: { score: true },
    }),
    prisma.testResult.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
  ]);

  const passRate =
    totalTests > 0 ? Math.round((passCount / totalTests) * 1000) / 10 : 0;
  const failRate =
    totalTests > 0 ? Math.round((failCount / totalTests) * 1000) / 10 : 0;
  const avgScore = avgScoreAggregate._avg.score ?? 0;

  return NextResponse.json({
    totalUsers,
    newUsers7d,
    questionCount,
    totalTests,
    testsToday,
    passRate,
    failRate,
    avgScore,
    activeUsers7d: activeUsersLast7d.length,
    passCount,
    failCount,
  });
}
