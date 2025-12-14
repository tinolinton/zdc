import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const requestedTake = Number(searchParams.get("take") ?? 25);
  const type = (searchParams.get("type") ?? "timed").toLowerCase();
  const categoriesParam = searchParams.get("categories");
  const categories =
    categoriesParam
      ?.split(",")
      .map((c) => c.trim())
      .filter(Boolean) ?? [];

  const signageFilter: { contains: string; mode: "insensitive" } = {
    contains: "sign",
    mode: "insensitive",
  };
  const diagramFilter: { contains: string; mode: "insensitive" } = {
    contains: "diagram",
    mode: "insensitive",
  };

  let where: Prisma.QuestionWhereInput | undefined;

  if (categories.length) {
    where = { category: { in: categories } };
  } else if (type === "signage") {
    where = { category: signageFilter };
  } else if (type === "diagrams" || type === "diagram") {
    where = { category: diagramFilter };
  } else if (type === "specialized") {
    where = {
      category: { not: null },
      NOT: [{ category: signageFilter }, { category: diagramFilter }],
    };
  }

  // Fetch all question ids to allow random selection without repeats
  const allIds = await prisma.question.findMany({
    where,
    select: { id: true },
  });

  const total = allIds.length;
  if (total === 0) {
    return NextResponse.json({ questions: [] });
  }

  // Fisher-Yates shuffle of IDs
  const ids = allIds.map((q) => q.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }

  const take = Math.max(1, Math.min(requestedTake, total));
  const selectedIds = ids.slice(0, take);

  const questions = await prisma.question.findMany({
    where: { id: { in: selectedIds } },
    include: {
      answers: {
        select: { id: true, text: true, isCorrect: true },
      },
    },
  });

  // Preserve the shuffled order and shuffle answers per question
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  const shuffledQuestions = selectedIds
    .map((id) => questionMap.get(id))
    .filter(Boolean)
    .map((q) => {
      const answers = [...q!.answers];
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }
      return {
        id: q!.id,
        text: q!.text,
        imageUrl: q!.imageUrl,
        answers,
      };
    });

  return NextResponse.json({
    questions: shuffledQuestions,
  });
}
