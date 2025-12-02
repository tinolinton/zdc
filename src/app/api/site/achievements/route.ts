import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [achievements, earned] = await Promise.all([
    prisma.achievement.findMany({
      orderBy: { createdAt: "asc" },
    }),
    prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      select: { achievementId: true },
    }),
  ]);

  const earnedIds = new Set(earned.map((e) => e.achievementId));

  return NextResponse.json({
    achievements: achievements.map((a) => ({
      ...a,
      earned: earnedIds.has(a.id),
    })),
  });
}
