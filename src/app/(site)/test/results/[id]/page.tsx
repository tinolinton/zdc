import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";

export default async function TestResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const result = await prisma.testResult.findUnique({
    where: { id },
  });

  if (!result || result.userId !== session.user.id) {
    notFound();
  }

  const total = 25;
  const percentage = Math.round((result.score / total) * 100);
  const passed =
    result.status.toUpperCase() === "PASS" || result.score >= total - 3;

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl text-center space-y-8">
      <div className="space-y-4">
        {passed ? (
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
        ) : (
          <XCircle className="h-24 w-24 text-red-500 mx-auto" />
        )}
        <h1 className="text-4xl font-bold">
          {passed ? "Test Passed!" : "Test Failed"}
        </h1>
        <p className="text-xl text-muted-foreground">
          You scored {result.score}/{total} ({percentage}%)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span>Correct Answers</span>
            <span className="font-bold text-green-600">{result.score}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span>Wrong Answers</span>
            <span className="font-bold text-red-600">
              {total - result.score}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span>Result</span>
            <span
              className={`font-bold ${
                passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {passed ? "PASS" : "FAIL"}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Link href="/">
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/test/timed">
          <Button>
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake Test
          </Button>
        </Link>
      </div>
    </div>
  );
}
