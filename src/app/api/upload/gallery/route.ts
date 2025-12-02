import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      max_results: 40,
      prefix: process.env.CLOUDINARY_UPLOAD_FOLDER || "zimdrive",
    });

    const images = (res.resources || []).map(
      (r: { secure_url: string; public_id: string }) => ({
        url: r.secure_url,
        public_id: r.public_id,
      }),
    );

    return NextResponse.json({ images });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load gallery" }, { status: 500 });
  }
}
