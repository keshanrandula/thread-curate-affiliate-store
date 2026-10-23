import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "featured" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    secondary: "bg-zinc-800 text-zinc-300 border-zinc-700",
    destructive: "bg-red-500/15 text-red-400 border-red-500/30",
    outline: "text-zinc-300 border-zinc-800",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    featured: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  }[variant];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
