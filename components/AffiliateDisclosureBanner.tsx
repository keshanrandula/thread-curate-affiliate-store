"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, X } from "lucide-react";

export function AffiliateDisclosureBanner({
  customText,
}: {
  customText?: string;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Affiliate Disclosure"
      className="bg-amber-500/10 dark:bg-indigo-950/60 border-b border-amber-500/20 dark:border-indigo-500/20 px-4 py-2 text-xs text-amber-950 dark:text-indigo-200/90 relative z-40 backdrop-blur-md transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-600 dark:text-indigo-400 shrink-0" />
          <span>
            {customText ||
              "Affiliate Disclosure: When you purchase through links on our site, we may earn an affiliate commission at no extra cost to you."}{" "}
            <Link
              href="/disclosure"
              className="underline text-amber-800 dark:text-indigo-300 hover:text-black dark:hover:text-white font-medium ml-1"
            >
              Learn more
            </Link>
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-700 dark:text-indigo-400 hover:text-stone-900 dark:hover:text-white p-1 rounded-md transition-colors"
          aria-label="Dismiss affiliate disclosure notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
