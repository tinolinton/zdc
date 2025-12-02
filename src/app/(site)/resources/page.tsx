import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

type Resource = {
  id: string;
  title: string;
  description: string;
  url: string | null;
};

async function getResources(): Promise<Resource[]> {
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/site/resources`, { cache: "no-store" }).catch(
    () => null
  );
  if (!res?.ok) return [];
  const data = (await res.json()) as { resources: Resource[] };
  return data.resources ?? [];
}

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <div className="container mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {resources.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No resources yet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Resources will appear here once added.
            </CardContent>
          </Card>
        ) : (
          resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader className="flex items-center justify-between gap-3">
                <CardTitle>{resource.title}</CardTitle>
                {resource.url ? (
                  <a
                    className="text-sm text-primary underline"
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                ) : null}
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {resource.description}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
