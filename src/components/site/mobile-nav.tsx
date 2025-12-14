"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  Menu,
  X,
  Home,
  User,
  Settings,
  LogOut,
  ClipboardList,
  ListChecks,
  FolderOpen,
  Bell,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";


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
  NavLink["icon"] | "home" | "admin" | "logout",
  React.ElementType
> = {
  home: Home,
  clipboard: ClipboardList,
  list: ListChecks,
  revision: ListChecks,
  resources: FolderOpen,
  notifications: Bell,
  profile: User,
  settings: Settings,
  admin: Crown,
  logout: LogOut,
};

interface MobileNavProps {
  links: NavLink[];
  isAdmin: boolean;
  userName?: string | null;
}

export function MobileNav({ links, isAdmin, userName }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  const toggleOpen = () => setIsOpen(!isOpen);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden relative z-50"
        onClick={toggleOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={toggleOpen}
                  className="fixed inset-0 z-9998 bg-black/60 backdrop-blur-sm md:hidden"
                />

                {/* Bottom Sheet */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 right-0 z-9999 flex flex-col rounded-t-4xl border-t border-border/50 bg-background/95 backdrop-blur-md p-6 pb-8 shadow-2xl md:hidden max-h-[85vh] overflow-y-auto"
                >
                  <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-muted" />

                  <div className="flex items-center gap-4 mb-8 px-2">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary/20 p-0.5">
                      <div className="h-full w-full rounded-full bg-muted flex items-center justify-center text-lg font-bold">
                        {(userName?.[0] || "U").toUpperCase()}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg">
                        {userName || "Guest User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isAdmin ? "Administrator" : "Student Driver"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href="/"
                      className={cn(
                        "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                        pathname === "/"
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Home className="h-5 w-5" />
                      Dashboard
                    </Link>

                    {links.map((link) => {
                      const Icon = iconMap[link.icon];
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {link.label}
                        </Link>
                      );
                    })}

                    <div className="my-2 h-px bg-border/50" />

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Crown className="h-5 w-5" />
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
