"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Star,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";

export interface FilterSidebarProps {
  availableBrands: string[];
  availableSizes?: string[];
  availableColors?: string[];
  minPriceLimit?: number;
  maxPriceLimit?: number;
}

export function FilterSidebar({
  availableBrands = [],
  availableSizes = ["XS", "S", "M", "L", "XL", "XXL"],
  availableColors = ["Black", "Indigo", "Honey Beige", "Olive", "Red", "Navy", "Charcoal Heather", "Sand Stone"],
  minPriceLimit = 0,
  maxPriceLimit = 500,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Active filters from searchParams
  const currentBrands = searchParams.get("brand")?.split(",").filter(Boolean) || [];
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSize = searchParams.get("size") || "";
  const currentColor = searchParams.get("color") || "";
  const currentRating = searchParams.get("rating") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value.trim()) {
      params.set(key, value.trim());
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleBrand = (b: string) => {
    let next: string[];
    if (currentBrands.includes(b)) {
      next = currentBrands.filter((x) => x !== b);
    } else {
      next = [...currentBrands, b];
    }
    updateParam("brand", next.length > 0 ? next.join(",") : null);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.has("q")) {
      params.set("q", searchParams.get("q")!);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasFilters =
    currentBrands.length > 0 ||
    !!currentMinPrice ||
    !!currentMaxPrice ||
    !!currentSize ||
    !!currentColor ||
    !!currentRating;

  const FilterContent = (
    <div className="space-y-6 text-xs text-stone-700 dark:text-zinc-300">
      {/* Header / Active tags */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-zinc-800">
        <span className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Filters</span>
        </span>
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[11px] text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2">
        <label className="font-semibold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]">
          Sort By
        </label>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full px-3 py-2 bg-stone-100 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="newest" className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-white">Newest Arrivals</option>
          <option value="popular" className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-white">Most Popular / Clicks</option>
          <option value="rating" className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-white">Highest Customer Rating</option>
          <option value="price-asc" className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-white">Price: Low to High</option>
          <option value="price-desc" className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-white">Price: High to Low</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-zinc-800/80">
        <div
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between cursor-pointer py-1 font-semibold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]"
        >
          <span>Price Range ($)</span>
          {collapsedSections["price"] ? <ChevronDown className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500" /> : <ChevronUp className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500" />}
        </div>

        {!collapsedSections["price"] && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                min="0"
                value={currentMinPrice}
                onChange={(e) => updateParam("minPrice", e.target.value)}
                className="w-full px-2.5 py-1.5 bg-stone-100 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-800 rounded-lg text-stone-900 dark:text-white text-xs placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <span className="text-stone-400 dark:text-zinc-500">&mdash;</span>
              <input
                type="number"
                placeholder="Max"
                min="0"
                value={currentMaxPrice}
                onChange={(e) => updateParam("maxPrice", e.target.value)}
                className="w-full px-2.5 py-1.5 bg-stone-100 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-800 rounded-lg text-stone-900 dark:text-white text-xs placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Quick Price Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Under $50", min: "", max: "50" },
                { label: "$50 - $100", min: "50", max: "100" },
                { label: "$100 - $200", min: "100", max: "200" },
                { label: "$200+", min: "200", max: "" },
              ].map((range) => {
                const isActive =
                  currentMinPrice === range.min && currentMaxPrice === range.max;
                return (
                  <button
                    key={range.label}
                    onClick={() => {
                      if (isActive) {
                        updateParam("minPrice", null);
                        updateParam("maxPrice", null);
                      } else {
                        updateParam("minPrice", range.min || null);
                        updateParam("maxPrice", range.max || null);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-sm"
                        : "bg-stone-100 dark:bg-zinc-900 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-800"
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Brands Filter */}
      {availableBrands.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-zinc-800/80">
          <div
            onClick={() => toggleSection("brand")}
            className="flex items-center justify-between cursor-pointer py-1 font-semibold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]"
          >
            <span>Brand ({availableBrands.length})</span>
            {collapsedSections["brand"] ? <ChevronDown className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500" /> : <ChevronUp className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500" />}
          </div>

          {!collapsedSections["brand"] && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {availableBrands.map((b) => {
                const checked = currentBrands.includes(b);
                return (
                  <label
                    key={b}
                    onClick={() => toggleBrand(b)}
                    className="flex items-center gap-2 cursor-pointer py-1 text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white transition-colors group"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        checked
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-500 text-white shadow-sm"
                          : "border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 group-hover:border-stone-400 dark:group-hover:border-zinc-500"
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </div>
                    <span className="text-xs select-none">{b}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sizes Filter */}
      {availableSizes.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-zinc-800/80">
          <div
            onClick={() => toggleSection("size")}
            className="flex items-center justify-between cursor-pointer py-1 font-semibold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]"
          >
            <span>Size</span>
            {collapsedSections["size"] ? <ChevronDown className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500" /> : <ChevronUp className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500" />}
          </div>

          {!collapsedSections["size"] && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {availableSizes.map((s) => {
                const active = currentSize.toLowerCase() === s.toLowerCase();
                return (
                  <button
                    key={s}
                    onClick={() => updateParam("size", active ? null : s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      active
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md shadow-orange-500/30"
                        : "bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 border-stone-200 dark:border-zinc-800 hover:border-stone-400 dark:hover:border-zinc-700 hover:text-stone-900 dark:hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Colors Filter */}
      {availableColors.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-zinc-800/80">
          <div
            onClick={() => toggleSection("color")}
            className="flex items-center justify-between cursor-pointer py-1 font-semibold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]"
          >
            <span>Color</span>
            {collapsedSections["color"] ? <ChevronDown className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500" /> : <ChevronUp className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500" />}
          </div>

          {!collapsedSections["color"] && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {availableColors.map((c) => {
                const active = currentColor.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    onClick={() => updateParam("color", active ? null : c)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                      active
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 font-bold shadow-sm"
                        : "bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 border-stone-200 dark:border-zinc-800 hover:border-stone-400 dark:hover:border-zinc-700 hover:text-stone-900 dark:hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Rating Filter */}
      <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-zinc-800/80">
        <div
          onClick={() => toggleSection("rating")}
          className="flex items-center justify-between cursor-pointer py-1 font-semibold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]"
        >
          <span>Minimum Rating</span>
          {collapsedSections["rating"] ? <ChevronDown className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500" /> : <ChevronUp className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500" />}
        </div>

        {!collapsedSections["rating"] && (
          <div className="space-y-1 pt-1">
            {[4.5, 4.0, 3.5].map((stars) => {
              const active = currentRating === String(stars);
              return (
                <button
                  key={stars}
                  onClick={() => updateParam("rating", active ? null : String(stars))}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    active
                      ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40"
                      : "hover:bg-stone-100 dark:hover:bg-zinc-900 text-stone-700 dark:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{stars} &amp; Up</span>
                  </div>
                  {active && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-stone-900 dark:text-white shadow-sm"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Filter &amp; Sort Products</span>
          </span>
          {hasFilters && (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-28 bg-white/80 dark:bg-zinc-950/70 p-5 rounded-2xl border border-stone-200 dark:border-zinc-800/80 backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
          {FilterContent}
        </div>
      </aside>

      {/* Mobile Slide-Out Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white dark:bg-zinc-950 border-l border-stone-200 dark:border-zinc-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800 mb-6">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white uppercase tracking-wider">
                    Filters &amp; Refinements
                  </h3>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-900"
                    aria-label="Close filters drawer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {FilterContent}
              </div>

              <div className="pt-6 border-t border-stone-200 dark:border-zinc-800 mt-6">
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full py-2.5 btn-amber-gradient text-white font-semibold text-xs rounded-xl shadow-lg transition-colors"
                >
                  View Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
