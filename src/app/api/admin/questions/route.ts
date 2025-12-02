import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

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
  const search = searchParams.get("search") ?? "";
  const pageParam = Number(searchParams.get("page") ?? 1);
  const sort = searchParams.get("sort") ?? "updatedAt";
  const order = (searchParams.get("order") ?? "desc").toLowerCase();
  const safePage = Math.max(1, pageParam);

  const where: Prisma.QuestionWhereInput | undefined = search
    ? {
        OR: [
          {
            text: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            category: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }
    : undefined;

  const sortOrder = order === "asc" ? Prisma.SortOrder.asc : Prisma.SortOrder.desc;
  const orderBy =
    sort === "createdAt"
      ? { createdAt: sortOrder }
      : sort === "text"
        ? { text: sortOrder }
        : { updatedAt: sortOrder };

  const [total, questions] = await Promise.all([
    prisma.question.count({ where }),
    prisma.question.findMany({
      where,
      orderBy,
      skip: (safePage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        answers: { select: { id: true, isCorrect: true } },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return NextResponse.json({
    total,
    page: Math.min(safePage, totalPages),
    totalPages,
    take: PAGE_SIZE,
    questions: questions.map((q) => ({
      id: q.id,
      text: q.text,
      category: q.category,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      answerCount: q.answers.length,
      correctCount: q.answers.filter((a) => a.isCorrect).length,
    })),
  });
}

export async function DELETE(req: Request) {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const ids: string[] = body?.ids ?? [];
  const deleteAll: boolean = body?.all === true;
  const search: string = body?.search ?? "";

  let where: Prisma.QuestionWhereInput | undefined;
  if (deleteAll) {
    if (search) {
      where = {
        OR: [
          {
            text: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            category: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      };
    } else {
      where = undefined;
    }
  } else {
    where = { id: { in: ids } };
  }

  if (!where || (!deleteAll && ids.length === 0)) {
    return NextResponse.json(
      { error: "No questions selected to delete." },
      { status: 400 },
    );
  }

  const result = await prisma.question.deleteMany({ where });

  return NextResponse.json({ deleted: result.count });
}
