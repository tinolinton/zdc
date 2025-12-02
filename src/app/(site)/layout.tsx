import { auth } from "@/auth";
import { proxy } from "@/lib/proxy";
import { SiteNavbar } from "@/components/site/navbar";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await proxy();
  const session = await auth();
  const role = session?.user?.role;
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";

  const links = [
    { href: "/test", label: "Tests", icon: "clipboard" as const },
    { href: "/test/results", label: "Results", icon: "list" as const },
    { href: "/test/revision", label: "Revision", icon: "revision" as const },
    { href: "/resources", label: "Resources", icon: "resources" as const },
    {
      href: "/notifications",
      label: "Notifications",
      icon: "notifications" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar
        links={links}
        isAdmin={isAdmin}
        userName={session?.user?.name ?? session?.user?.email ?? ""}
      />
      <main>{children}</main>
    </div>
  );
}
