"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileQuestion,
  Settings,
  LogOut,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Questions",
    href: "/admin/questions",
    icon: FileQuestion,
  },
  {
    title: "Tests",
    href: "/admin/tests",
    icon: BookOpen,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "hidden md:flex h-full flex-col bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border/50 shadow-xl transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo Header */}
      <div className="flex h-16 items-center border-b border-sidebar-border/50 px-4">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-3 transition-all duration-300",
            isCollapsed ? "justify-center w-full" : ""
          )}
        >
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src="/logo/lx2.svg"
              alt="ZimDrive Coach"
              fill
              className="object-contain"
            />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-sm tracking-tight text-sidebar-foreground">
              Admin Panel
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <TooltipProvider>
          <nav
            className={cn(
              "flex flex-col gap-1.5 px-3 text-sm font-medium",
              isCollapsed ? "items-center" : ""
            )}
          >
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return isCollapsed ? (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="glass-popover">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary/10 text-sidebar-foreground shadow-sm ring-1 ring-sidebar-primary/20"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </TooltipProvider>
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border/50 p-3 space-y-2">
        <TooltipProvider>
          <div className={cn("flex", isCollapsed ? "justify-center" : "")}>
            {isCollapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Sign Out</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="glass-popover">
                  Sign Out
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 rounded-xl text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            )}
          </div>
        </TooltipProvider>

        {/* Collapse Toggle */}
        <div
          className={cn("flex", isCollapsed ? "justify-center" : "justify-end")}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "h-8 w-8 rounded-lg border border-sidebar-border/50 bg-sidebar-accent/50 text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
