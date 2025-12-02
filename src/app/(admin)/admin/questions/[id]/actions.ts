"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

type UpdatePayload = {
  id: string;
  text: string;
  category: string | null;
  imageUrl: string | null;
  answers: { text: string; isCorrect: boolean }[];
};

export async function updateQuestionAction(payload: UpdatePayload) {
  console.log("updateQuestionAction started", payload);
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    console.log("updateQuestionAction unauthorized", session?.user);
    return { ok: false, error: "Unauthorized" };
  }

  if (!payload.id) return { ok: false, error: "Missing question id" };
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

  const question = await prisma.question.findUnique({
    where: { id: payload.id },
  });
  if (!question) return { ok: false, error: "Question not found." };

  await prisma.$transaction([
    prisma.answer.deleteMany({ where: { questionId: payload.id } }),
    prisma.question.update({
      where: { id: payload.id },
      data: {
        text: payload.text.trim(),
        category: payload.category,
        imageUrl: payload.imageUrl || null,
        answers: {
          create: payload.answers.map((a) => ({
            text: a.text.trim(),
            isCorrect: !!a.isCorrect,
          })),
        },
      },
    }),
  ]);

  console.log("updateQuestionAction success");
  return { ok: true };
}
