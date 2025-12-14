"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
import { MobileNav } from "@/components/site/mobile-nav";

type NavLink = {
  href: string;
  label: string;
  icon:
    | "clipboard"
    | "list"
    | "revision"
    | "resources"
    | "notifications"
    | "profile"
    | "settings";
};

const iconMap: Record<
  NavLink["icon"],
  React.ComponentType<{ className?: string }>
> = {
  clipboard: ClipboardList,
  list: ListChecks,
  revision: ListChecks,
  resources: FolderOpen,
  notifications: Bell,
  profile: UserIcon,
  settings: SettingsIcon,
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
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const initials = (userName ?? "User")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border/10 bg-background/60 backdrop-blur-md supports-backdrop-filter:bg-background/20">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9 overflow-hidden transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/logo/lx2.svg"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
            ZimDrive Coach
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex justify-center flex-1">
          {links.map((link) => {
            const Icon = iconMap[link.icon];
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 dark:hover:bg-white/5",
                  active
                    ? "bg-primary/10 text-primary shadow-sm shadow-primary/10 ring-1 ring-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-white/10 dark:hover:bg-white/5"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border-2 border-transparent hover:border-primary/20 transition-all"
              >
                <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {initials || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 glass-popover p-2">
              <DropdownMenuLabel className="px-2 py-1.5 text-center">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                asChild
                className="mb-1 focus:bg-primary/10 focus:text-primary rounded-lg cursor-pointer"
              >
                <Link href="/profile" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="mb-1 focus:bg-primary/10 focus:text-primary rounded-lg cursor-pointer"
              >
                <Link href="/settings" className="flex items-center gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem
                  asChild
                  className="mb-1 focus:bg-accent-violet/10 focus:text-accent-violet rounded-lg cursor-pointer"
                >
                  <Link href="/admin" className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-accent-violet" />
                    Admin Console
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                className="focus:bg-destructive/10 focus:text-destructive rounded-lg cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <MobileNav links={links} isAdmin={isAdmin} userName={userName} />
        </div>
      </div>
    </header>
  );
}
