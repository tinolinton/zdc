"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createQuestionAction } from "./actions";
import Image from "next/image";

const CATEGORY_OPTIONS = [
  { value: "Diagram", label: "Diagram" },
  { value: "Signage", label: "Signage" },
  { value: "Traffic Lights (Robots)", label: "Traffic Lights (Robots)" },
  { value: "Genearal Rule", label: "Genearal Rule" },
  { value: "other", label: "Other (enter custom)" },
];

export default function AddQuestionPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<
    { url: string; public_id: string }[]
  >([]);
  const [answers, setAnswers] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [error, setError] = useState<string | null>(null);

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
      return [...prev, { text: "", isCorrect: false }];
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

  const clearImage = () => {
    setImageUrl("");
  };

  const onSave = () => {
    setError(null);

    const trimmedText = text.trim();
    if (!trimmedText) {
      toast.error("Question text is required.");
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
      toast.error("Provide 2 or 3 answers, each with text.");
      return;
    }

    if (!preparedAnswers.some((a) => a.isCorrect)) {
      toast.error("Mark at least one answer as correct.");
      return;
    }

    const resolvedCategory =
      category === "other" ? customCategory.trim() : category.trim();

    if (category === "other" && !resolvedCategory) {
      toast.error("Enter a custom category or pick one from the list.");
      return;
    }

    startTransition(async () => {
      const result = await createQuestionAction({
        text: trimmedText,
        category: resolvedCategory || null,
        imageUrl: imageUrl || null,
        answers: preparedAnswers,
      });

      if (!result.ok) {
        setError(result.error || "Failed to create question");
        toast.error(result.error || "Failed to create question");
        return;
      }

      toast.success("Question created successfully");
      router.push("/admin/questions");
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/questions">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add Question</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Question Details</CardTitle>
            <CardDescription>
              Enter the question text and select a category.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v);
                  if (v !== "other") setCustomCategory("");
                }}
              >
                <SelectTrigger>
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
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter category name"
                />
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="question">Question Text</Label>
              <Textarea
                id="question"
                placeholder="Enter the question here..."
                className="min-h-[100px]"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Image (Optional)</Label>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Answers</CardTitle>
            <CardDescription>
              Provide 2-3 multiple choice options and mark the correct one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {answers.map((answer, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="grid flex-1 gap-2">
                    <Label>Option {String.fromCharCode(65 + idx)}</Label>
                    <Input
                      placeholder="Answer text..."
                      value={answer.text}
                      onChange={(e) => updateAnswerText(idx, e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-8">
                    <input
                      type="radio"
                      name="correct"
                      className="h-4 w-4"
                      checked={answer.isCorrect}
                      onChange={() => setCorrectIndex(idx)}
                    />
                    <Label>Correct</Label>
                  </div>
                  {answers.length > 2 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="self-start text-muted-foreground"
                      onClick={() => removeAnswer(idx)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
            {answers.length < 3 ? (
              <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
                Add optional third answer
              </Button>
            ) : null}
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-4">
          <Link href="/admin/questions">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={onSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Question"}
          </Button>
        </div>
      </div>
    </div>
  );
}
