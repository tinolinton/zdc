"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Settings = {
  maintenanceMode: boolean;
  supportEmail: string;
  senderName: string;
  defaultPassingScore: number;
  announcementsEnabled: boolean;
};

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: Settings;
}) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateField = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = () => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Failed to save (${res.status})`);
        }
        setSuccess("Settings saved.");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to save";
        setError(msg);
      }
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label htmlFor="maintenance">Maintenance mode</Label>
              <p className="text-xs text-muted-foreground">
                Temporarily disable user access.
              </p>
            </div>
            <Switch
              id="maintenance"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                updateField("maintenanceMode", checked)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passingScore">Default passing score</Label>
            <Input
              id="passingScore"
              type="number"
              min={0}
              max={25}
              value={settings.defaultPassingScore}
              onChange={(e) =>
                updateField("defaultPassingScore", Number(e.target.value))
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label htmlFor="announcements">Announcements</Label>
              <p className="text-xs text-muted-foreground">
                Show broadcast messages to users.
              </p>
            </div>
            <Switch
              id="announcements"
              checked={settings.announcementsEnabled}
              onCheckedChange={(checked) =>
                updateField("announcementsEnabled", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Communication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => updateField("supportEmail", e.target.value)}
              placeholder="support@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderName">Sender name</Label>
            <Input
              id="senderName"
              value={settings.senderName}
              onChange={(e) => updateField("senderName", e.target.value)}
              placeholder="ZimDrive Coach"
            />
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2 flex items-center justify-between">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : success ? (
          <p className="text-sm text-green-600">{success}</p>
        ) : (
          <span />
        )}
        <Button onClick={onSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
