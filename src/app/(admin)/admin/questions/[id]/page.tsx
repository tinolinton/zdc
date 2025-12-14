import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import QuestionEditor from "./question-editor";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export type Question = {
  id: string;
  text: string;
  category: string | null;
  imageUrl: string | null;
  answers: { id: string; text: string; isCorrect: boolean }[];
};

async function getQuestion(id: string): Promise<Question | null> {
  const cookieHeader = (await cookies()).toString();
  const base =
    process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";
  const url = new URL(`/api/admin/questions/${id}`, base).toString();

  const res = await fetch(url, {
    cache: "no-store",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to load question (${res.status})`);
  }

  const data = (await res.json()) as { question: Question };
  return data.question;
}

type ParamsInput = { id: string } | Promise<{ id: string }>;
type SearchParamsInput =
  | { page?: string; search?: string; sort?: string }
  | Promise<{ page?: string; search?: string; sort?: string }>;

async function resolveParams(input: ParamsInput) {
  return input instanceof Promise ? input : Promise.resolve(input);
}

async function resolveSearchParams(input?: SearchParamsInput) {
  if (!input) return undefined;
  return input instanceof Promise ? input : Promise.resolve(input);
}

export default async function EditQuestionPage({
  params,
  searchParams,
}: {
  params: ParamsInput;
  searchParams?: SearchParamsInput;
}) {
  const { id } = await resolveParams(params);
  if (!id) {
    notFound();
  }

  const question = await getQuestion(id);

  if (!question) {
    notFound();
  }

  const resolvedSearch = await resolveSearchParams(searchParams);
  const { page, search, sort } = resolvedSearch || {};
  const backParams = new URLSearchParams();
  if (page) backParams.set("page", page);
  if (search) backParams.set("search", search);
  if (sort) backParams.set("sort", sort);
  const backUrl = backParams.toString()
    ? `/admin/questions?${backParams.toString()}`
    : "/admin/questions";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={backUrl}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Question</h1>
      </div>
      <QuestionEditor
        initialQuestion={question}
        returnPage={page ?? null}
        returnSearch={search ?? null}
        returnSort={sort ?? null}
      />
    </div>
  );
}
