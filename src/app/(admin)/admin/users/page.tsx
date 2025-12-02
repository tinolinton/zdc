import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
};

async function getUsers(search = ""): Promise<UserRow[]> {
  const cookieHeader = (await cookies()).toString();
  const baseUrl =
    process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";
  const url = new URL(`${baseUrl}/api/admin/users`);
  if (search) url.searchParams.set("search", search);
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });
    if (!res.ok) throw new Error("Failed to load users");
    const data = (await res.json()) as { users: UserRow[] };
    return data.users;
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name ?? user.username ?? "Unknown"}
                  </TableCell>
                  <TableCell>{user.email ?? "N/A"}</TableCell>
                  <TableCell className="capitalize">
                    {user.role.toLowerCase()}
                  </TableCell>
                  <TableCell>
                    {user.isVerified ? "Verified" : "Unverified"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    —
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
