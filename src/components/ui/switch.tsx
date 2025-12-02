"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "checked"
  > {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative inline-flex h-6 w-11 cursor-pointer items-center",
          className,
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <span className="absolute inset-0 rounded-full bg-muted transition peer-checked:bg-primary" />
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 translate-x-1 rounded-full bg-background shadow transition",
            checked ? "translate-x-5" : "translate-x-1",
          )}
        />
      </label>
    );
  },
);
Switch.displayName = "Switch";
