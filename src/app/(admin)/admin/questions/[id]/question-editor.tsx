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

type QuestionEditorProps = {
  initialQuestion: Question;
};

export default function QuestionEditor({ initialQuestion }: QuestionEditorProps) {
  const router = useRouter();
  const [text, setText] = useState(initialQuestion.text);
  const [category, setCategory] = useState(initialQuestion.category ?? "");
  const [imageUrl, setImageUrl] = useState(initialQuestion.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<{ url: string; public_id: string }[]>([]);
  const [answers, setAnswers] = useState(
    initialQuestion.answers.map((a) => ({
      id: a.id,
      text: a.text,
      isCorrect: a.isCorrect,
    })),
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateAnswerText = (index: number, value: string) => {
    setAnswers((prev) =>
      prev.map((a, i) => (i === index ? { ...a, text: value } : a)),
    );
  };

  const setCorrectIndex = (index: number) => {
    setAnswers((prev) => prev.map((a, i) => ({ ...a, isCorrect: i === index })));
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
      preparedAnswers.length !== 3 ||
      preparedAnswers.some((a) => !a.text)
    ) {
      const msg = "Provide exactly three answers with text.";
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
      const result = await updateQuestionAction({
        id: initialQuestion.id,
        text: trimmedText,
        category: category || null,
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
      router.push("/admin/questions");
    });
  };

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
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-auto border rounded p-2">
                    {galleryImages.map((img) => (
                      <button
                        key={img.public_id}
                        type="button"
                        onClick={() => setImageUrl(img.url)}
                        className="group relative rounded border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <Image
                          src={img.url}
                          alt="Gallery"
                          width={400}
                          height={400}
                          className="h-28 w-full rounded object-cover"
                          sizes="200px"
                        />
                        <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
                      </button>
                    ))}
                  </div>
            ) : null}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Category</p>
        <input
          className="w-full rounded border bg-background p-2 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Optional"
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Answers</p>
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
            </div>
          ))}
        </div>
      </div>
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : success ? (
        <p className="text-sm text-green-600">{success}</p>
      ) : null}
      <div className="flex justify-end gap-3">
        <Link href="/admin/questions">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={onSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
