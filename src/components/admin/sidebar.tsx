"use client";

import Link from "next/link";
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
        "flex h-full flex-col border-r bg-linear-to-b from-background to-muted/50 shadow-inner transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <div
          className={cn(
            "flex w-full items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-sm font-semibold tracking-tight",
            isCollapsed ? "justify-center" : ""
          )}
        >
          {isCollapsed ? "ZP" : "ZimProvisional Admin"}
        </div>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <TooltipProvider>
          <nav
            className={cn(
              "flex flex-col gap-2 px-2 text-sm font-medium",
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
                        "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-muted hover:text-foreground",
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="flex items-center gap-4"
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl px-3 py-3 text-center transition-all hover:-translate-y-px hover:bg-muted hover:text-foreground",
                    isActive
                      ? "bg-primary/10 text-foreground ring-1 ring-primary/50"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </TooltipProvider>
      </div>
      <div className="border-t p-3 space-y-3">
        <TooltipProvider>
          <div className={cn("flex", isCollapsed ? "justify-center" : "")}>
            {isCollapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Sign Out</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign Out</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-center gap-3 text-muted-foreground hover:text-primary"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            )}
          </div>
        </TooltipProvider>
        <div
          className={cn(
            "flex",
            isCollapsed ? "justify-center" : "justify-end"
          )}
        >
          <Button
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "border shadow-sm transition-all",
              isCollapsed
                ? "h-9 w-9 rounded-full bg-muted"
                : "h-10 w-full justify-center gap-2 rounded-lg bg-primary/10 hover:bg-primary/20"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
