import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const SETTINGS_KEY = "app-settings";

type AppSettings = {
  maintenanceMode: boolean;
  supportEmail: string;
  senderName: string;
  defaultPassingScore: number;
  announcementsEnabled: boolean;
};

const defaultSettings: AppSettings = {
  maintenanceMode: false,
  supportEmail: "support@example.com",
  senderName: "ZimDrive Coach",
  defaultPassingScore: 22,
  announcementsEnabled: true,
};

async function getSettings(): Promise<AppSettings> {
  try {
    const record = await prisma.appSetting.findUnique({
      where: { key: SETTINGS_KEY },
    });
    if (!record) return defaultSettings;
    return { ...defaultSettings, ...(record.value as AppSettings) };
  } catch {
    // Fallback to raw query if model not on client (old generated client)
    const rows =
      ((await prisma.$queryRawUnsafe(
        `SELECT value FROM "AppSetting" WHERE key = $1 LIMIT 1`,
        SETTINGS_KEY,
      )) as { value: unknown }[]) || [];
    if (!rows[0]) return defaultSettings;
    return { ...defaultSettings, ...(rows[0].value as AppSettings) };
  }
}

export async function GET() {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const settings: AppSettings = {
    maintenanceMode: !!body.maintenanceMode,
    supportEmail: body.supportEmail || defaultSettings.supportEmail,
    senderName: body.senderName || defaultSettings.senderName,
    defaultPassingScore:
      Number(body.defaultPassingScore) || defaultSettings.defaultPassingScore,
    announcementsEnabled:
      body.announcementsEnabled ?? defaultSettings.announcementsEnabled,
  };

  try {
    await prisma.appSetting.upsert({
      where: { key: SETTINGS_KEY },
      update: { value: settings },
      create: { key: SETTINGS_KEY, value: settings },
    });
  } catch {
    // Raw upsert fallback if model missing on client
    await prisma.$executeRawUnsafe(
      `INSERT INTO "AppSetting" (key, value, "createdAt", "updatedAt")
       VALUES ($1, $2, NOW(), NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, "updatedAt" = NOW();`,
      SETTINGS_KEY,
      settings,
    );
  }

  return NextResponse.json({ settings });
}
