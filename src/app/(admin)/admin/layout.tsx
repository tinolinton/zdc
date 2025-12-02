import { AdminSidebar } from "@/components/admin/sidebar";
import { proxy } from "@/lib/proxy";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await proxy("ADMIN");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
          <div className="w-full flex-1">
            {/* Add search or breadcrumbs here later */}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
