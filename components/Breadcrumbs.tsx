import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-stone-500 dark:text-zinc-400 mb-6 flex-wrap gap-1.5 transition-colors">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-stone-900 dark:hover:text-white transition-colors"
      >
        <Home className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-stone-400 dark:text-zinc-600 shrink-0" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-stone-900 dark:hover:text-white transition-colors max-w-[150px] truncate"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-stone-900 dark:text-zinc-200 font-semibold max-w-[220px] truncate" aria-current="page">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
