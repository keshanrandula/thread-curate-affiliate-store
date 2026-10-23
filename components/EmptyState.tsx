import Link from "next/link";
import { Sparkles, RotateCcw, ShoppingBag } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  resetHref?: string;
  resetLabel?: string;
}

export function EmptyState({
  title = "No products found",
  description = "No items matched your current filter criteria. Try adjusting or clearing your filters.",
  resetHref = "/shop",
  resetLabel = "Clear All Filters",
}: EmptyStateProps) {
  return (
    <div className="glass-panel p-12 sm:p-16 rounded-3xl text-center max-w-lg mx-auto my-8 border border-zinc-800/80 shadow-2xl space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto shadow-inner">
        <ShoppingBag className="w-8 h-8 stroke-1 text-zinc-400" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
          {description}
        </p>
      </div>

      <div className="pt-2">
        <Link
          href={resetHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{resetLabel}</span>
        </Link>
      </div>
    </div>
  );
}
