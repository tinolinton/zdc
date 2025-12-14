"use client";

import { Toaster } from "sonner";
import Image from "next/image";

export function BrandToaster() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      duration={4000}
      gap={12}
      toastOptions={{
        style: {
          background: "transparent",
          border: "none",
          boxShadow: "none",
          width: "auto",
          maxWidth: "380px",
        },
        classNames: {
          toast:
            "group relative pointer-events-auto flex w-full max-w-sm items-start gap-3 overflow-hidden " +
            "!rounded-2xl !border !border-white/10 " +
            "!bg-[oklch(0.98_0_0_/_0.72)] dark:!bg-[oklch(0.13_0_0_/_0.55)] " +
            "!backdrop-blur-xl p-4 shadow-xl " +
            "after:absolute after:inset-y-0 after:left-0 after:w-1 after:content-[''] " +
            "data-[type=success]:after:!bg-accent-emerald " +
            "data-[type=error]:after:!bg-destructive " +
            "data-[type=warning]:after:!bg-accent-amber " +
            "data-[type=info]:after:!bg-accent-violet",
          title: "text-sm font-semibold leading-tight text-foreground",
          description: "mt-1 text-xs leading-relaxed text-muted-foreground",
          actionButton:
            "!rounded-lg !bg-primary !px-3 !py-2 text-xs font-medium !text-primary-foreground transition-all duration-200 hover:!bg-primary/90",
          cancelButton:
            "!rounded-lg !bg-muted !px-3 !py-2 text-xs font-medium !text-foreground transition-all duration-200 hover:!bg-muted/80",
          success:
            "!border-accent-emerald/35 !shadow-[0_18px_45px_rgb(0,0,0,0.18)] !shadow-accent-emerald/12",
          error:
            "!border-destructive/35 !shadow-[0_18px_45px_rgb(0,0,0,0.18)] !shadow-destructive/12",
          warning:
            "!border-accent-amber/35 !shadow-[0_18px_45px_rgb(0,0,0,0.18)] !shadow-accent-amber/12",
          info:
            "!border-accent-violet/35 !shadow-[0_18px_45px_rgb(0,0,0,0.18)] !shadow-accent-violet/12",
          icon:
            "mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/60 " +
            "backdrop-blur-sm dark:bg-white/5",
        },
      }}
      icons={{
        success: (
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent-emerald/30 bg-accent-emerald/20 shadow-sm">
            <Image
              src="/logo/lx2.svg"
              alt="ZimDrive"
              fill
              className="object-contain p-1.5"
            />
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-accent-emerald border-2 border-background" />
          </div>
        ),
        error: (
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-destructive/25 bg-destructive/15 shadow-sm">
            <Image
              src="/logo/lx2.svg"
              alt="ZimDrive"
              fill
              className="object-contain p-1.5"
            />
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background" />
          </div>
        ),
        warning: (
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent-amber/25 bg-accent-amber/20 shadow-sm">
            <Image
              src="/logo/lx2.svg"
              alt="ZimDrive"
              fill
              className="object-contain p-1.5"
            />
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-accent-amber border-2 border-background" />
          </div>
        ),
        info: (
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent-violet/25 bg-accent-violet/20 shadow-sm">
            <Image
              src="/logo/lx2.svg"
              alt="ZimDrive"
              fill
              className="object-contain p-1.5"
            />
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-accent-violet border-2 border-background" />
          </div>
        ),
        loading: (
          <div className="flex h-8 w-8 items-center justify-center shrink-0">
            <Image
              src="/logo/lx2.svg"
              alt="Loading"
              width={24}
              height={24}
              className="animate-pulse object-contain"
            />
          </div>
        ),
      }}
    />
  );
}
