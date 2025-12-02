import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, RotateCcw } from "lucide-react";
import Link from "next/link";

type TestResult = {
  id: string;
  score: number;
  status: string;
  createdAt: string;
};

async function getResults(): Promise<TestResult[]> {
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/site/tests`, { cache: "no-store" }).catch(
    () => null
  );
  if (!res?.ok) return [];
  const data = (await res.json()) as { results: TestResult[] };
  return data.results ?? [];
}

export default async function RevisionPage() {
  const results = await getResults();
  const totalAttempts = results.length;
  const totalCorrect = results.reduce((acc, curr) => acc + curr.score, 0);
  const totalQuestions = results.length * 25;
  const wrongCount = Math.max(totalQuestions - totalCorrect, 0);

  return (
    <div className="container mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revision Mode</h1>
          <p className="text-muted-foreground">
            Review questions you got wrong and keep practicing until you pass.
          </p>
        </div>
        <Link href="/test/timed">
          <Button variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake a test
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-3">
          <ListChecks className="h-6 w-6 text-primary" />
          <CardTitle>Wrong-answer queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Total attempts tracked: <strong>{totalAttempts}</strong>
          </p>
          <p>
            Approx. wrong answers to review: <strong>{wrongCount}</strong>
          </p>
          <p>
            When detailed answer data is stored, this will surface those specific
            questions for spaced repetition.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
