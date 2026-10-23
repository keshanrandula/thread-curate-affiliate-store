"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Flame, Sparkles } from "lucide-react";
import { ProductCard } from "./ProductCard";

export interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  icon?: "flame" | "sparkles";
  products: any[];
  viewAllHref?: string;
}

export function ProductCarousel({
  title,
  subtitle,
  icon = "sparkles",
  products,
  viewAllHref = "/shop",
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-xs font-semibold mb-2">
            {icon === "flame" ? (
              <Flame className="w-3.5 h-3.5 text-orange-500" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            )}
            <span className="text-stone-600 dark:text-zinc-300 uppercase tracking-wider text-[10px]">
              Curated Edit
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 mt-1 max-w-xl">{subtitle}</p>
          )}
        </div>

        {/* Carousel Arrow Controls & View All */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Link
            href={viewAllHref}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 transition-colors pr-2"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-4 snap-x snap-mandatory scrollbar-none"
        >
          {products.map((p, idx) => (
            <div
              key={p._id}
              className="w-[260px] sm:w-[280px] lg:w-[300px] shrink-0 snap-start"
            >
              <ProductCard product={p} priority={idx < 2} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
