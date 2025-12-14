import { auth } from "@/auth";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AnimatedBackground } from "@/components/site/animated-background";
import Image from "next/image";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userName = session?.user?.name ?? session?.user?.email ?? "Admin";

  return (
    <div className="flex h-screen bg-muted/20 relative overflow-hidden">
      <AnimatedBackground />
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <header className="flex h-14 items-center gap-3 border-b border-border/10 bg-background/60 backdrop-blur-md px-4 md:hidden">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted/60"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-border/50 bg-background/80">
              <Image
                src="/logo/lx2.svg"
                alt="ZimDrive Coach"
                fill
                className="object-contain p-1.5"
              />
            </div>
            <span className="text-sm font-semibold">Admin</span>
          </Link>
          <div className="ml-auto flex items-center">
            <AdminMobileNav userName={userName} />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
