import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { cookies } from "next/headers";

type TestResult = {
  id: string;
  score: number;
  status: string;
  createdAt: string;
};

type TestSummary = {
  testsTaken: number;
  averageScorePercent: number;
  lastTest: TestResult | null;
  results: TestResult[];
};

async function getTests(): Promise<TestSummary> {
  const cookieHeader = (await cookies()).toString();
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/site/tests`, {
    cache: "no-store",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  }).catch(() => null);
  if (!res?.ok) {
    return {
      testsTaken: 0,
      averageScorePercent: 0,
      lastTest: null,
      results: [],
    };
  }
  return res.json();
}

export default async function UserDashboard() {
  const { testsTaken, averageScorePercent, lastTest, results } =
    await getTests();
  const session = await auth();
  const role = session?.user?.role;
  const isAdmin =
    role === "ADMIN" || role === "SUPERADMIN";

  return (
    <div className="container mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        <Button asChild>
          <Link href="/test">
            <PlayCircle className="mr-2 h-4 w-4" />
            Take New Test
          </Link>
        </Button>
        {isAdmin && (
          <Link href="/admin">
            <Button variant="outline">Admin Console</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testsTaken}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isNaN(averageScorePercent) ? "0%" : `${averageScorePercent}%`}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastTest ? lastTest.status : "No tests yet"}
            </div>
            {lastTest ? (
              <p className="text-xs text-muted-foreground">
                {new Date(lastTest.createdAt).toLocaleString()}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm">
                    No tests taken yet.
                  </TableCell>
                </TableRow>
              ) : (
                results.map((result) => {
                  const percent = Math.round((result.score / 25) * 100);
                  const isPass =
                    result.status.toUpperCase() === "PASS" || result.score >= 22;
                  return (
                    <TableRow key={result.id}>
                      <TableCell>
                        {new Date(result.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {result.score}/25 ({percent}%)
                      </TableCell>
                      <TableCell
                        className={
                          isPass ? "text-green-600 font-medium" : "text-red-600"
                        }
                      >
                        {isPass ? "Pass" : "Fail"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/test/results/${result.id}`}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Revision
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
