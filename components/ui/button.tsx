import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "indigo";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]";

    const variantStyles = {
      default: "bg-zinc-100 text-zinc-900 hover:bg-white shadow-sm",
      destructive:
        "bg-red-600/90 text-white hover:bg-red-500 shadow-sm shadow-red-900/30",
      outline:
        "border border-zinc-800 bg-transparent text-zinc-200 hover:bg-zinc-900 hover:text-white",
      secondary:
        "bg-zinc-800 text-zinc-200 hover:bg-zinc-700/80 hover:text-white",
      ghost: "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
      link: "text-indigo-400 underline-offset-4 hover:underline p-0 h-auto",
      indigo:
        "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-600/25",
    }[variant];

    const sizeStyles = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-[11px]",
      lg: "h-11 rounded-xl px-6 text-sm",
      icon: "h-9 w-9 p-0",
    }[size];

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles, sizeStyles, className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, cn };
