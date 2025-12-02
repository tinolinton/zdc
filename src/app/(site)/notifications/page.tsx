import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

async function getNotifications(): Promise<Notification[]> {
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/site/notifications`, { cache: "no-store" }).catch(
    () => null
  );
  if (!res?.ok) return [];
  const data = (await res.json()) as { notifications: Notification[] };
  return data.notifications ?? [];
}

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="container mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          {notifications.length === 0 ? (
            <div>No notifications yet. Exam tips, custom tests, and pass/fail alerts will show here.</div>
          ) : (
            notifications.map((note) => (
              <div key={note.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between text-foreground">
                  <p className="font-medium">{note.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-sm">{note.body}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
