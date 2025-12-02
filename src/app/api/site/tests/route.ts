import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const DEFAULT_PASS_MARK = 22;

async function getPassMark() {
  try {
    const record = await prisma.appSetting.findUnique({
      where: { key: "app-settings" },
    });
    const value = (record?.value as { defaultPassingScore?: number })?.defaultPassingScore;
    if (typeof value === "number" && value > 0) return value;
  } catch {
    try {
      const rows =
        ((await prisma.$queryRawUnsafe(
          `SELECT value FROM "AppSetting" WHERE key = $1 LIMIT 1`,
          "app-settings",
        )) as { value: { defaultPassingScore?: number } }[]) || [];
      const value = rows[0]?.value?.defaultPassingScore;
      if (typeof value === "number" && value > 0) return value;
    } catch {
      // ignore
    }
  }
  return DEFAULT_PASS_MARK;
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await prisma.testResult.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const testsTaken = results.length;
  const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);
  const averageScore = testsTaken ? totalScore / testsTaken : 0;

  return NextResponse.json({
    testsTaken,
    averageScorePercent: Math.round((averageScore / 25) * 100),
    lastTest: results[0] ?? null,
    results,
  });
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const responses: { questionId: string; answerId: string }[] =
    body?.responses ?? [];

  if (!responses.length) {
    return NextResponse.json(
      { error: "No answers submitted." },
      { status: 400 },
    );
  }

  const questionIds = Array.from(
    new Set(responses.map((r) => r.questionId).filter(Boolean)),
  );

  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
    include: { answers: { select: { id: true, isCorrect: true } } },
  });

  const answerMap = new Map<string, boolean>();
  questions.forEach((q) => {
    q.answers.forEach((a) => {
      answerMap.set(a.id, a.isCorrect);
    });
  });

  let score = 0;
  responses.forEach((r) => {
    if (answerMap.get(r.answerId)) score += 1;
  });

  const passMark = await getPassMark();
  const status = score >= passMark ? "PASS" : "FAIL";

  const result = await prisma.testResult.create({
    data: {
      userId: session.user.id,
      score,
      status,
      answers: responses,
    },
  });

  return NextResponse.json({ id: result.id, score, status });
}
