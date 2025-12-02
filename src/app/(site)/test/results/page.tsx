import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { cookies } from "next/headers";

type TestResult = {
  id: string;
  score: number;
  status: string;
  createdAt: string;
};

async function getResults(): Promise<TestResult[]> {
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
  if (!res?.ok) return [];
  const data = (await res.json()) as { results: TestResult[] };
  return data.results ?? [];
}

export default async function TestResultsIndexPage() {
  const results = await getResults();

  return (
    <div className="container mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Results</h1>
          <p className="text-muted-foreground">
            Review your past attempts and jump into detailed views.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-sm text-muted-foreground"
                  >
                    No results yet. Take a test to see your history here.
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
                        <Link
                          className="underline text-sm"
                          href={`/test/results/${result.id}`}
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="text-sm text-muted-foreground">
        Detailed result pages are available via each “View” link above.
      </div>
    </div>
  );
}
