"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const getColor = (value: number) => {
  if (value < 25) return "bg-red-600"; // Red for weak
  if (value < 50) return "bg-orange-500"; // Orange for moderate
  if (value < 75) return "bg-yellow-400"; // Yellow for decent
  return "bg-green-500"; // Green for strong
};

const PasswordStrengthVisualizer = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value = 0, ...props }, ref) => {
  const colorClass = getColor(value ?? 0);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={`h-full w-full flex-1 transition-all ${colorClass}`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

PasswordStrengthVisualizer.displayName = ProgressPrimitive.Root.displayName;

export { PasswordStrengthVisualizer };
