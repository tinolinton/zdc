import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, TimerReset } from "lucide-react";
import Link from "next/link";

const tests = [
  {
    title: "Timed Mock Test",
    description: "25 random questions • 10 minutes",
    icon: Clock,
    href: "/test/timed",
  },
  {
    title: "Signage Test",
    description: "Road signs & markings focus • 10 minutes",
    icon: BookOpen,
    href: "/test/signage",
  },
  {
    title: "Diagram Test",
    description: "Intersection & right-of-way diagrams • 10 minutes",
    icon: TimerReset,
    href: "/test/diagrams",
  },
  {
    title: "Specialized",
    description: "Custom categories assigned by admins",
    icon: BookOpen,
    href: "/test/specialized",
  },
];

export default function TestLandingPage() {
  return (
    <div className="container mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Choose a Test</h1>
          <p className="text-muted-foreground">
            Pick a mode and start practicing for your provisional exam.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((test) => (
          <Card key={test.title}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle>{test.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {test.description}
                </p>
              </div>
              <test.icon className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <Link href={test.href}>
                <Button className="w-full">Start</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
