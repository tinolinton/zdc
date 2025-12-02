"use client";

import { Toaster } from "sonner";

export function BrandToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={3500}
      toastOptions={{
        classNames: {
          toast:
            "border border-primary/15 bg-gradient-to-r from-primary/5 via-background to-background shadow-xl shadow-primary/10 backdrop-blur-sm",
          title: "font-semibold text-foreground",
          description: "text-sm text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary/40",
          cancelButton:
            "bg-muted text-foreground hover:bg-muted/80 focus:ring-2 focus:ring-primary/20",
          success: "border-emerald-500/30",
          error: "border-red-500/30",
          warning: "border-amber-500/30",
          info: "border-sky-500/30",
        },
      }}
    />
  );
}
