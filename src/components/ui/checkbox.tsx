"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "checked"
  > {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, ...props }, ref) => {
    return (
      <label
        className={cn(
          "inline-flex h-4 w-4 items-center justify-center rounded border border-input bg-background shadow-sm",
          checked ? "bg-primary/10 border-primary" : "",
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
        <span
          className={cn(
            "block h-2 w-2 rounded-sm bg-primary opacity-0 transition peer-checked:opacity-100",
          )}
        />
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";
