"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({
  className = "",
  showMenu = false,
}: {
  className?: string;
  showMenu?: boolean;
}) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Skeleton placeholder to prevent hydration mismatch
    return (
      <div
        className={`w-9 h-9 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-100 dark:bg-zinc-900/60 opacity-60 ${className}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (showMenu) {
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select theme"
          className="flex items-center gap-1.5 p-2 rounded-xl text-stone-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 bg-stone-100 dark:bg-zinc-900/80 hover:bg-stone-200 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-800 transition-colors"
        >
          {theme === "system" ? (
            <Laptop className="w-4 h-4 text-amber-500" />
          ) : isDark ? (
            <Moon className="w-4 h-4 text-amber-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xl p-1.5 z-50 text-xs">
              <button
                type="button"
                onClick={() => {
                  setTheme("light");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  theme === "light"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme("dark");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme("system");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  theme === "system"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-amber-500" />
                <span>System</span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Quick 1-click toggle with animated sun/moon
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      className={`relative p-2 rounded-xl border transition-all duration-300 active:scale-90 flex items-center justify-center ${
        isDark
          ? "bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 border-zinc-800 hover:border-amber-500/40 shadow-sm shadow-black/40"
          : "bg-white hover:bg-stone-100 text-amber-600 border-stone-200 hover:border-amber-400 shadow-sm shadow-stone-200"
      } ${className}`}
    >
      <div className="relative w-4 h-4">
        {/* Sun Icon */}
        <Sun
          className={`w-4 h-4 absolute inset-0 transition-all duration-300 ${
            isDark
              ? "opacity-0 rotate-90 scale-50"
              : "opacity-100 rotate-0 scale-100 text-amber-600"
          }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`w-4 h-4 absolute inset-0 transition-all duration-300 ${
            isDark
              ? "opacity-100 rotate-0 scale-100 text-amber-400"
              : "opacity-0 -rotate-90 scale-50"
          }`}
        />
      </div>
    </button>
  );
}
