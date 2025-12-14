import { auth } from "@/auth";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AnimatedBackground } from "@/components/site/animated-background";

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
        <header className="flex h-14 items-center gap-4 border-b border-border/10 bg-background/60 backdrop-blur-md px-6 lg:h-[60px]">
          <div className="md:hidden">
            <AdminMobileNav userName={userName} />
          </div>
          <div className="flex-1"></div>
          {/* We could add user dropdown here for desktop admin header as well */}
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
