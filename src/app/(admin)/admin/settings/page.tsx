import prisma from "@/lib/prisma";
import SettingsForm from "./settings-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const defaultSettings = {
  maintenanceMode: false,
  supportEmail: "support@example.com",
  senderName: "ZimDrive Coach",
  defaultPassingScore: 22,
  announcementsEnabled: true,
};

async function loadSettings() {
  try {
    const record = await prisma.appSetting.findUnique({
      where: { key: "app-settings" },
    });
    if (!record) return defaultSettings;
    return { ...defaultSettings, ...(record.value as unknown as object) };
  } catch {
    // Fallback to raw query if model missing on client
    const rows =
      ((await prisma.$queryRawUnsafe(
        `SELECT value FROM "AppSetting" WHERE key = $1 LIMIT 1`,
        "app-settings",
      )) as { value: unknown }[]) || [];
    if (!rows[0]) return defaultSettings;
    return { ...defaultSettings, ...(rows[0].value as object) };
  }
}

export default async function AdminSettingsPage() {
  const settings = await loadSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage administrative preferences for the platform.
        </p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
