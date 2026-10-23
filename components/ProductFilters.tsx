"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: CategoryOption[];
  brands: string[];
  currentCategory?: string;
  currentBrand?: string;
  currentSort?: string;
}

export function ProductFilters({
  categories,
  brands,
  currentCategory,
  currentBrand,
  currentSort = "newest",
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 on filter change
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  const hasActiveFilters =
    searchParams.has("category") ||
    searchParams.has("brand") ||
    searchParams.has("sort") ||
    searchParams.has("q");

  return (
    <div className="bg-white/80 dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-5 mb-8 backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            onClick={() => handleFilterChange("category", "")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              !currentCategory
                ? "btn-amber-gradient text-white shadow-md shadow-orange-500/20"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700/80 dark:hover:text-white"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id || cat.slug}
              onClick={() => handleFilterChange("category", cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                currentCategory === cat.slug
                  ? "btn-amber-gradient text-white shadow-md shadow-orange-500/20"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700/80 dark:hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Brand & Sort Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Brand select */}
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-zinc-800/70 border border-stone-300 dark:border-zinc-700/60 rounded-xl px-3 py-1.5">
            <span className="text-xs text-stone-500 dark:text-zinc-400 font-medium">Brand:</span>
            <select
              value={currentBrand || ""}
              onChange={(e) => handleFilterChange("brand", e.target.value)}
              className="bg-transparent text-xs text-stone-900 dark:text-white focus:outline-none cursor-pointer pr-2"
            >
              <option value="" className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-white">
                All Brands
              </option>
              {brands.map((b) => (
                <option key={b} value={b} className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-white">
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Sort select */}
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-zinc-800/70 border border-stone-300 dark:border-zinc-700/60 rounded-xl px-3 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500 dark:text-zinc-400" />
            <select
              value={currentSort || "newest"}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="bg-transparent text-xs text-stone-900 dark:text-white focus:outline-none cursor-pointer pr-2"
            >
              <option value="newest" className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-white">
                Newest Arrivals
              </option>
              <option value="popular" className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-white">
                Most Popular
              </option>
              <option value="rating" className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-white">
                Highest Rated
              </option>
              <option value="price-asc" className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-white">
                Price: Low to High
              </option>
              <option value="price-desc" className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-white">
                Price: High to Low
              </option>
            </select>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium px-2 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
