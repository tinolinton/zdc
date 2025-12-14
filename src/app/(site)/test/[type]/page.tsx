"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Timer } from "lucide-react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function TestPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const router = useRouter();
  const { type } = use(params);
  const normalizedType = (type ?? "timed").toLowerCase();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<
    {
      id: string;
      text: string;
      imageUrl?: string | null;
      answers: { id: string; text: string }[];
    }[]
  >([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTimeLeft(600);
    setCurrentQuestion(0);
    setSelected({});

    const fetchQuestions = async () => {
      const res = await fetch(
        `/api/site/questions?take=25&type=${encodeURIComponent(normalizedType)}`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) return;
      const data = await res.json();
      setQuestions(
        (data.questions ?? []).map(
          (q: {
            id: string;
            text: string;
            imageUrl?: string | null;
            answers: { id: string; text: string }[];
          }) => ({
            id: q.id,
            text: q.text,
            imageUrl: q.imageUrl,
            answers: q.answers,
          })
        )
      );
    };
    fetchQuestions();
  }, [normalizedType]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const current = questions[currentQuestion];

  const handleSubmit = async () => {
    if (!questions.length) {
      toast.error("No questions to submit.");
      return;
    }
    const responses = questions
      .map((q) => ({
        questionId: q.id,
        answerId: selected[q.id],
      }))
      .filter((r) => r.answerId);

    if (!responses.length) {
      toast.error("Select at least one answer before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/site/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses, type: normalizedType }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to submit (${res.status})`);
      }
      const data = await res.json();
      toast.success("Test submitted");
      router.push(`/test/results/${data.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit test";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold capitalize">{type} Test</h1>
        <div className="flex items-center gap-2 text-xl font-mono font-bold text-primary">
          <Timer className="h-6 w-6" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="mb-4 flex justify-between text-sm text-muted-foreground">
        <span>
          Question {questions.length ? currentQuestion + 1 : 0} of{" "}
          {questions.length || 0}
        </span>
        <span>
          Progress:{" "}
          {questions.length
            ? Math.round(((currentQuestion + 1) / questions.length) * 100)
            : 0}
          %
        </span>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          {current?.imageUrl ? (
            <div className="w-full overflow-hidden rounded border bg-muted/40">
              <Image
                src={current.imageUrl}
                alt="Question"
                width={900}
                height={600}
                className="w-full h-auto max-h-80 object-contain bg-black/5"
                sizes="(max-width: 768px) 100vw, 900px"
                priority
              />
            </div>
          ) : null}
          <CardTitle className="text-lg leading-6">
            {current ? current.text : "No questions available yet."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {current ? (
            <RadioGroup
              className="grid gap-4"
              value={selected[current.id] ?? ""}
              onValueChange={(value) =>
                setSelected((prev) => ({ ...prev, [current.id]: value }))
              }
            >
              {current.answers.map((answer) => (
                <div
                  key={answer.id}
                  className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted"
                >
                  <RadioGroupItem value={answer.id} id={answer.id} />
                  <Label htmlFor={answer.id} className="flex-1 cursor-pointer">
                    {answer.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <p className="text-muted-foreground text-sm">
              Add questions in the admin panel to start practicing.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (currentQuestion === Math.max(questions.length - 1, 0)) {
                handleSubmit();
              } else {
                setCurrentQuestion((prev) =>
                  Math.min(prev + 1, Math.max(questions.length - 1, 0))
                );
              }
            }}
            disabled={!questions.length || submitting}
          >
            {currentQuestion === Math.max(questions.length - 1, 0)
              ? submitting
                ? "Submitting..."
                : "Submit Test"
              : "Next Question"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
