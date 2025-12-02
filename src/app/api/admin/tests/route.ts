import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const PAGE_SIZE = 25;

export async function GET(req: Request) {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1") || 1;
  const status = searchParams.get("status")?.toUpperCase();

  const where =
    status && status !== "ALL"
      ? { status: { equals: status, mode: "insensitive" as const } }
      : undefined;

  const [total, tests] = await Promise.all([
    prisma.testResult.count({ where }),
    prisma.testResult.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (Math.max(page, 1) - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        user: { select: { email: true, username: true, name: true } },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return NextResponse.json({
    page: Math.min(Math.max(page, 1), totalPages),
    total,
    totalPages,
    tests: tests.map((t) => ({
      id: t.id,
      userName: t.user?.name || t.user?.username || "Unknown",
      email: t.user?.email ?? "N/A",
      score: t.score,
      status: t.status ?? "UNKNOWN",
      createdAt: t.createdAt,
    })),
  });
}
