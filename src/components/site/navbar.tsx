"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Sun,
  Moon,
  User as UserIcon,
  Bell,
  ListChecks,
  FolderOpen,
  ClipboardList,
  Settings as SettingsIcon,
  LogOut,
  Crown,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
  icon: "clipboard" | "list" | "revision" | "resources" | "notifications" | "profile" | "settings";
};

export function SiteNavbar({
  links,
  isAdmin,
  userName,
}: {
  links: NavLink[];
  isAdmin: boolean;
  userName?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const initials = (userName ?? "User")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const iconMap: Record<NavLink["icon"], React.ComponentType<{ className?: string }>> = {
    clipboard: ClipboardList,
    list: ListChecks,
  revision: ListChecks,
  resources: FolderOpen,
  notifications: Bell,
  profile: UserIcon,
  settings: SettingsIcon,
  };

  const renderLinks = (className?: string) =>
    links.map((link) => {
      const Icon = iconMap[link.icon];
      const active = pathname === link.href;
      return (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:text-primary",
            active ? "bg-muted text-primary" : "text-muted-foreground",
            className
          )}
          onClick={() => setOpen(false)}
        >
          <Icon className="h-4 w-4" />
          {link.label}
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold text-lg">
          ZimDrive Coach
        </Link>
        <div className="hidden items-center gap-2 md:flex justify-center flex-1">
          {renderLinks()}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{initials || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 text-center">
            <DropdownMenuLabel className="text-center">Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="justify-center">
              <Link href="/profile" className="flex items-center gap-2 justify-center">
                <UserIcon className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="justify-center">
              <Link href="/settings" className="flex items-center gap-2 justify-center">
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild className="justify-center">
                <Link href="/admin" className="flex items-center gap-2 justify-center">
                  <Crown className="h-4 w-4" />
                  Admin
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 justify-center"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-t bg-background px-6 py-3 md:hidden">
          <div className="flex flex-col">{renderLinks("w-full")}</div>
        </div>
      )}
    </header>
  );
}
