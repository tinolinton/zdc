"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

type CreatePayload = {
  text: string;
  category: string | null;
  imageUrl: string | null;
  answers: { text: string; isCorrect: boolean }[];
};

export async function createQuestionAction(payload: CreatePayload) {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    return { ok: false, error: "Unauthorized" };
  }

  if (!payload.text.trim())
    return { ok: false, error: "Question text is required." };
  if (
    payload.answers.length !== 3 ||
    payload.answers.some((a) => !a.text.trim())
  ) {
    return { ok: false, error: "Provide exactly three answers with text." };
  }
  if (!payload.answers.some((a) => a.isCorrect)) {
    return { ok: false, error: "Mark at least one answer as correct." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const lastQuestion = await tx.question.findFirst({
        orderBy: { orderIndex: "desc" },
        select: { orderIndex: true },
      });
      const nextOrderIndex = (lastQuestion?.orderIndex ?? 0) + 1;

      await tx.question.create({
        data: {
          orderIndex: nextOrderIndex,
          text: payload.text.trim(),
          category: payload.category,
          imageUrl: payload.imageUrl,
          answers: {
            create: payload.answers.map((a) => ({
              text: a.text.trim(),
              isCorrect: !!a.isCorrect,
            })),
          },
        },
      });
    });
    return { ok: true };
  } catch (error) {
    console.error("Failed to create question:", error);
    return { ok: false, error: "Failed to create question" };
  }
}
