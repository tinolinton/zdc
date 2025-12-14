"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Trash2 } from "lucide-react";

type QuestionRow = {
  id: string;
  text: string;
  category: string | null;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  answerCount: number;
  correctCount: number;
};

type QuestionResponse = {
  questions: QuestionRow[];
  total: number;
  page: number;
  totalPages: number;
  take: number;
};

const SORTS = [
  { value: "orderIndex:asc", label: "Original (PDF/JSON order)" },
  { value: "orderIndex:desc", label: "Original (reverse)" },
  { value: "updatedAt:desc", label: "Updated (newest)" },
  { value: "updatedAt:asc", label: "Updated (oldest)" },
  { value: "createdAt:desc", label: "Created (newest)" },
  { value: "createdAt:asc", label: "Created (oldest)" },
  { value: "text:asc", label: "A -> Z" },
  { value: "text:desc", label: "Z -> A" },
];

async function fetchQuestions(params: {
  page: number;
  search: string;
  sort: string;
}): Promise<QuestionResponse> {
  const url = new URL("/api/admin/questions", window.location.origin);
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("search", params.search);
  const [sortField, sortOrder] = params.sort.split(":");
  url.searchParams.set("sort", sortField);
  url.searchParams.set("order", sortOrder);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load questions");
  return (await res.json()) as QuestionResponse;
}

async function deleteQuestions(payload: {
  ids?: string[];
  all?: boolean;
  search?: string;
}) {
  const res = await fetch("/api/admin/questions", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to delete questions");
  }
  return (await res.json()) as { deleted: number };
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const searchParams = useSearchParams();
  const initialPage = useMemo(() => {
    const value = Number(searchParams.get("page") ?? "1");
    return Number.isFinite(value) && value > 0 ? value : 1;
  }, [searchParams]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(25);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("orderIndex:asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const hasLoadedInitial = useRef(false);
  const hasHandledSearchSort = useRef(false);

  const offset = useMemo(() => (page - 1) * take, [page, take]);
  const pageNumbers = useMemo(() => {
    const pages: Array<number | string> = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
      return pages;
    }

    const addRange = (start: number, end: number) => {
      for (let i = start; i <= end; i += 1) pages.push(i);
    };

    pages.push(1);

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    if (start > 2) pages.push("…");
    addRange(start, end);
    if (end < totalPages - 1) pages.push("…");

    pages.push(totalPages);

    return pages;
  }, [page, totalPages]);

  const load = async (pageOverride?: number) => {
    setLoading(true);
    setError(null);
    try {
      const targetPage = pageOverride ?? page;
      const data = await fetchQuestions({
        page: targetPage,
        search,
        sort,
      });
      setQuestions(data.questions);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setTake(data.take);
      setSelected(new Set());
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load questions";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hasLoadedInitial.current = true;
    load(initialPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPage]);

  useEffect(() => {
    // Reset to first page when search or sort changes
    if (!hasLoadedInitial.current) return;
    if (!hasHandledSearchSort.current) {
      hasHandledSearchSort.current = true;
      return;
    }
    setPage(1);
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(questions.map((q) => q.id)));
    } else {
      setSelected(new Set());
    }
  };

  const toggleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const onBulkDelete = async (deleteAll = false) => {
    const ids = deleteAll ? [] : Array.from(selected);
    if (!deleteAll && ids.length === 0) return;
    const confirmMessage = deleteAll
      ? "Delete ALL questions matching this filter?"
      : `Delete ${ids.length} selected question(s)?`;
    if (!window.confirm(confirmMessage)) return;
    try {
      await deleteQuestions({
        ids,
        all: deleteAll,
        search: deleteAll ? search : undefined,
      });
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete questions");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            disabled={selected.size === 0}
            onClick={() => onBulkDelete(false)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkDelete(true)}
          >
            Delete All (filter)
          </Button>
          <Button asChild>
            <Link href="/admin/questions/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search questions..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v)}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {total === 0 ? 0 : offset + 1}-{Math.min(offset + take, total)}{" "}
        of {total}
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selected.size === questions.length && questions.length > 0
                  }
                  onCheckedChange={(c) => toggleSelectAll(Boolean(c))}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-14 text-center">#</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Answers</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-sm text-red-600"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm">
                  No questions found.
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question, idx) => {
                const rowNumber = offset + idx + 1;
                const truncated =
                  question.text.length > 120
                    ? question.text.slice(0, 120) + "…"
                    : question.text;
                return (
                  <TableRow key={question.id} className="hover:bg-muted/40">
                    <TableCell>
                      <Checkbox
                        checked={selected.has(question.id)}
                        onCheckedChange={(c) =>
                          toggleSelect(question.id, Boolean(c))
                        }
                        aria-label={`Select question ${rowNumber}`}
                      />
                    </TableCell>
                    <TableCell className="text-center text-xs font-semibold text-muted-foreground">
                      {rowNumber}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <Link
                        href={`/admin/questions/${
                          question.id
                        }?page=${page}&search=${encodeURIComponent(
                          search
                        )}&sort=${sort}`}
                        className="block truncate underline underline-offset-2"
                        title={question.text}
                      >
                        {truncated}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {question.category ?? "Uncategorized"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {question.answerCount} total / {question.correctCount}{" "}
                      correct
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {new Date(question.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => load(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {pageNumbers.map((p, idx) =>
              typeof p === "number" ? (
                <Button
                  key={`page-${p}-${idx}`}
                  size="sm"
                  variant={p === page ? "default" : "outline"}
                  onClick={() => load(p)}
                  aria-label={`Go to page ${p}`}
                >
                  {p}
                </Button>
              ) : (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-muted-foreground"
                >
                  {p}
                </span>
              )
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => load(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
