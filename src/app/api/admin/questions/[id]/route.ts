import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  if (!id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      answers: {
        select: { id: true, text: true, isCorrect: true },
      },
    },
  });

  if (!question) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ question });
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const body = await req.json().catch(() => null);
  const text: string | undefined = body?.text;
  const category: string | null | undefined = body?.category ?? null;
  const imageUrl: string | null | undefined = body?.imageUrl ?? null;
  const answers: { text: string; isCorrect?: boolean }[] = Array.isArray(
    body?.answers,
  )
    ? body.answers
    : [];

  if (!id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!text || answers.length !== 3) {
    return NextResponse.json(
      { error: "Text and exactly three answers are required." },
      { status: 400 },
    );
  }

  if (!answers.some((a) => a?.isCorrect)) {
    return NextResponse.json(
      { error: "At least one answer must be marked correct." },
      { status: 400 },
    );
  }

  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.answer.deleteMany({ where: { questionId: id } }),
    prisma.question.update({
      where: { id },
      data: {
        text,
        category,
        imageUrl,
        answers: {
          create: answers.map((a) => ({
            text: a.text,
            isCorrect: !!a.isCorrect,
          })),
        },
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
