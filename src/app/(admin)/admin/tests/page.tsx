import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type TestRow = {
  id: string;
  userName: string;
  email: string;
  score: number;
  status: string;
  createdAt: string;
};

type TestResponse = {
  tests: TestRow[];
  total: number;
  page: number;
  totalPages: number;
};

async function getTests(page = 1, status = "ALL"): Promise<TestResponse> {
  const cookieHeader = (await cookies()).toString();
  const base =
    process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";
  const url = new URL("/api/admin/tests", base);
  url.searchParams.set("page", String(page));
  url.searchParams.set("status", status);

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  if (!res.ok) {
    throw new Error("Failed to load tests");
  }

  return (await res.json()) as TestResponse;
}

const statusFilters = [
  { value: "ALL", label: "All" },
  { value: "PASS", label: "Pass" },
  { value: "FAIL", label: "Fail" },
];

export default async function AdminTestsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; status?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const pageParam = params?.page ?? "1";
  const status = (params?.status ?? "ALL").toUpperCase();
  const page = Number.isNaN(Number(pageParam)) ? 1 : Number(pageParam);
  const { tests, total, page: currentPage, totalPages } = await getTests(
    page,
    status,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
          <p className="text-sm text-muted-foreground">
            Showing latest results. Total: {total}
          </p>
        </div>
        <div className="flex gap-2">
          {statusFilters.map((f) => (
            <Button
              key={f.value}
              variant={status === f.value ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/admin/tests?status=${f.value}&page=1`}>
                {f.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm">
                  No tests found.
                </TableCell>
              </TableRow>
            ) : (
              tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.userName}</TableCell>
                  <TableCell>{test.email}</TableCell>
                  <TableCell>{test.score}</TableCell>
                  <TableCell className="uppercase text-xs font-semibold">
                    {test.status}
                  </TableCell>
                  <TableCell>
                    {new Date(test.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={currentPage <= 1}
          >
            <Link href={`/admin/tests?page=${currentPage - 1}&status=${status}`}>
              Previous
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={currentPage >= totalPages}
          >
            <Link href={`/admin/tests?page=${currentPage + 1}&status=${status}`}>
              Next
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
