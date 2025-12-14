"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Question } from "./page";
import { toast } from "sonner";
import { updateQuestionAction } from "./actions";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const CATEGORY_OPTIONS = [
  { value: "Diagram", label: "Diagram" },
  { value: "Signage", label: "Signage" },
  { value: "Traffic Lights (Robots)", label: "Traffic Lights (Robots)" },
  { value: "Genearal Rule", label: "Genearal Rule" },
  { value: "other", label: "Other (enter custom)" },
];

type QuestionEditorProps = {
  initialQuestion: Question;
  returnPage?: string | null;
  returnSearch?: string | null;
  returnSort?: string | null;
};

export default function QuestionEditor({
  initialQuestion,
  returnPage,
  returnSearch,
  returnSort,
}: QuestionEditorProps) {
  const router = useRouter();
  const [text, setText] = useState(initialQuestion.text);
  const [category, setCategory] = useState<string>(() => {
    const current = initialQuestion.category ?? "";
    const match = CATEGORY_OPTIONS.find((c) => c.value === current);
    if (current && !match) return "other";
    return current;
  });
  const [customCategory, setCustomCategory] = useState<string>(() => {
    const current = initialQuestion.category ?? "";
    const match = CATEGORY_OPTIONS.find((c) => c.value === current);
    return current && !match ? current : "";
  });
  const [imageUrl, setImageUrl] = useState(initialQuestion.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<
    { url: string; public_id: string }[]
  >([]);
  const [answers, setAnswers] = useState(
    initialQuestion.answers.map((a) => ({
      id: a.id,
      text: a.text,
      isCorrect: a.isCorrect,
    }))
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateAnswerText = (index: number, value: string) => {
    setAnswers((prev) =>
      prev.map((a, i) => (i === index ? { ...a, text: value } : a))
    );
  };

  const setCorrectIndex = (index: number) => {
    setAnswers((prev) =>
      prev.map((a, i) => ({ ...a, isCorrect: i === index }))
    );
  };

  const addAnswer = () => {
    setAnswers((prev) => {
      if (prev.length >= 3) return prev;
      const newId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `new-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      return [...prev, { id: newId, text: "", isCorrect: false }];
    });
  };

  const removeAnswer = (index: number) => {
    setAnswers((prev) => {
      if (prev.length <= 2) return prev;
      const next = prev.filter((_, i) => i !== index);
      if (!next.some((a) => a.isCorrect)) {
        next[0] = { ...next[0], isCorrect: true };
      }
      return next;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "questions");
      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: data,
      });
      if (!res.ok) {
        let msg = `Upload failed (${res.status})`;
        try {
          const body = await res.json();
          if (body?.error) msg = body.error;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }
      const body = await res.json();
      setImageUrl(body.url);
      toast.success("Image uploaded");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const clearImage = () => {
    setImageUrl("");
  };

  const loadGallery = async () => {
    setGalleryError(null);
    setGalleryLoading(true);
    try {
      const res = await fetch("/api/upload/gallery", { cache: "no-store" });
      if (!res.ok) {
        let msg = `Failed to load gallery (${res.status})`;
        try {
          const body = await res.json();
          if (body?.error) msg = body.error;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }
      const body = await res.json();
      setGalleryImages(body.images || []);
      setGalleryOpen(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load gallery";
      setGalleryError(msg);
      toast.error(msg);
    } finally {
      setGalleryLoading(false);
    }
  };

  const onSave = () => {
    setError(null);
    setSuccess(null);

    // client-side validation before hitting API
    const trimmedText = text.trim();
    if (!trimmedText) {
      const msg = "Question text is required.";
      setError(msg);
      toast.error(msg);
      return;
    }
    const preparedAnswers = answers.map((a) => ({
      ...a,
      text: a.text.trim(),
    }));
    if (
      preparedAnswers.length < 2 ||
      preparedAnswers.length > 3 ||
      preparedAnswers.some((a) => !a.text)
    ) {
      const msg = "Provide 2 or 3 answers, each with text.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!preparedAnswers.some((a) => a.isCorrect)) {
      const msg = "Mark at least one answer as correct.";
      setError(msg);
      toast.error(msg);
      return;
    }

    startTransition(async () => {
      const resolvedCategory =
        category === "other" ? customCategory.trim() : category.trim();

      if (category === "other" && !resolvedCategory) {
        const msg = "Enter a custom category or pick one from the list.";
        setError(msg);
        toast.error(msg);
        return;
      }

      const result = await updateQuestionAction({
        id: initialQuestion.id,
        text: trimmedText,
        category: resolvedCategory || null,
        imageUrl: imageUrl || null,
        answers: preparedAnswers,
      });

      if (!result.ok) {
        const msg = result.error || "Failed to save";
        setError(msg);
        toast.error(msg);
        return;
      }

      setSuccess("Question updated.");
      toast.success("Question saved");

      const backParams = new URLSearchParams();
      if (returnPage) backParams.set("page", returnPage);
      if (returnSearch) backParams.set("search", returnSearch);
      if (returnSort) backParams.set("sort", returnSort);

      const backTo = backParams.toString()
        ? `/admin/questions?${backParams.toString()}`
        : "/admin/questions";
      router.push(backTo);
    });
  };

  const backParams = new URLSearchParams();
  if (returnPage) backParams.set("page", returnPage);
  if (returnSearch) backParams.set("search", returnSearch);
  if (returnSort) backParams.set("sort", returnSort);
  const backUrl = backParams.toString()
    ? `/admin/questions?${backParams.toString()}`
    : "/admin/questions";

  return (
    <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Question</p>
        <textarea
          className="w-full rounded border bg-background p-2 text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Image</p>
        {imageUrl ? (
          <div className="space-y-2">
            <Image
              src={imageUrl}
              alt="Question"
              width={800}
              height={450}
              className="max-h-48 w-full rounded border bg-background object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearImage}>
                Replace Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={handleFileChange}
              />
              <Button variant="outline" size="sm" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={loadGallery}
                disabled={galleryLoading}
              >
                {galleryLoading ? "Loading..." : "Choose from Gallery"}
              </Button>
              {galleryError ? (
                <p className="text-xs text-red-600">{galleryError}</p>
              ) : null}
            </div>
            {galleryOpen && galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-auto rounded border bg-muted/40 p-3">
                {galleryImages.map((img) => (
                  <button
                    key={img.public_id}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className="group relative overflow-hidden rounded-lg border bg-linear-to-br from-background to-muted shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <div className="relative aspect-4/3 w-full">
                      <Image
                        src={img.url}
                        alt="Gallery"
                        fill
                        className="object-contain p-2 transition duration-200 group-hover:scale-105"
                        sizes="(max-width: 768px) 45vw, 240px"
                      />
                    </div>
                    <span className="absolute inset-0 bg-black/10 opacity-0 transition group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <Label className="text-sm text-muted-foreground">Category</Label>
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            if (v !== "other") setCustomCategory("");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {category === "other" ? (
          <Input
            className="w-full rounded border bg-background p-2 text-sm"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Enter category name"
          />
        ) : null}
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Answers</p>
        <p className="text-xs text-muted-foreground">
          Keep between two and three answers. Add an optional third below if
          needed.
        </p>
        <div className="space-y-2">
          {answers.map((answer, idx) => (
            <div
              key={answer.id}
              className="flex items-center gap-2 rounded border bg-background p-2 text-sm"
            >
              <input
                type="radio"
                name="correct"
                checked={answer.isCorrect}
                onChange={() => setCorrectIndex(idx)}
                className="h-4 w-4"
              />
              <input
                className="flex-1 rounded border px-2 py-1"
                value={answer.text}
                onChange={(e) => updateAnswerText(idx, e.target.value)}
              />
              {answers.length > 2 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => removeAnswer(idx)}
                  aria-label={`Remove answer ${idx + 1}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          ))}
          {answers.length < 3 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAnswer}
              className="mt-1"
            >
              Add optional third answer
            </Button>
          ) : null}
        </div>
      </div>
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : success ? (
        <p className="text-sm text-green-600">{success}</p>
      ) : null}
      <div className="flex justify-end gap-3">
        <Link href={backUrl}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={onSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
