"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  FileQuestion,
  BookOpen,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

export function AdminMobileNav({ userName }: { userName?: string | null }) {
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

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
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

                  <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="relative h-16 w-16">
                      <Image
                        src="/logo/lx2.svg"
                        alt="ZimDrive Coach"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-lg">Admin Panel</p>
                      {userName && (
                        <p className="text-sm text-muted-foreground">
                          Signed in as {userName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {sidebarItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.title}
                        </Link>
                      );
                    })}

                    <div className="my-2 h-px bg-border/50" />

                    <Link
                      href="/"
                      className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Home className="h-5 w-5" />
                      Back to Site
                    </Link>

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
