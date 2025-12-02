import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export async function proxy(requiredRole?: Role) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  if (requiredRole) {
    const userRole = session.user.role;
    if (userRole === "SUPERADMIN") return session;

    if (requiredRole === "ADMIN" && userRole !== "ADMIN") {
      redirect("/");
    }

    if (
      requiredRole === "USER" &&
      userRole !== "USER" &&
      userRole !== "ADMIN"
    ) {
      // Allow Admin to access User routes? Maybe.
      // For now, let's keep it simple.
    }
  }

  return session;
}
