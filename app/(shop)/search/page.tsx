import type { Metadata } from "next";
import { Search, Sparkles } from "lucide-react";
import { getProducts, getFilterOptions } from "@/lib/api";
import { ProductGrid } from "@/components/ProductGrid";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const title = q ? `Search results for "${q}" | Thread & Curate` : "Search Catalog | Thread & Curate";
  const description = `Browse verified fashion deals matching "${q || "curated clothes"}".`;
  return {
    title,
    description,
    alternates: {
      canonical: q ? `/search?q=${encodeURIComponent(q)}` : "/search",
    },
    openGraph: {
      title,
      description,
      url: "/search",
      type: "website",
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string;
    color?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const resolved = await searchParams;
  const query = resolved.q || "";
  const currentPage = Number(resolved.page) || 1;

  const [filterOptions, result] = await Promise.all([
    getFilterOptions(),
    getProducts({
      query,
      brand: resolved.brand,
      minPrice: resolved.minPrice ? Number(resolved.minPrice) : undefined,
      maxPrice: resolved.maxPrice ? Number(resolved.maxPrice) : undefined,
      size: resolved.size,
      color: resolved.color,
      rating: resolved.rating ? Number(resolved.rating) : undefined,
      sort: (resolved.sort as any) || "newest",
      page: currentPage,
      limit: 12,
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Search", href: "/search" },
          { label: query ? `"${query}"` : "All Results" },
        ]}
      />

      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-stone-100 via-white to-amber-100/50 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-amber-950/20 border border-stone-200 dark:border-amber-500/20 rounded-3xl p-6 sm:p-10 mb-10 shadow-lg dark:shadow-xl space-y-4 transition-colors">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 dark:border-amber-500/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Search Results</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {query ? (
              <span>
                Search: &ldquo;<span className="text-amber-600 dark:text-amber-400">{query}</span>&rdquo;
              </span>
            ) : (
              "Browse All Curated Deals"
            )}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 mt-1">
            Found <strong className="text-stone-900 dark:text-white">{result.total}</strong> products matching your query across verified merchants.
          </p>
        </div>

        {/* Live Search Input Box */}
        <form action="/search" method="GET" className="max-w-xl flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400 dark:text-zinc-500" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by title, brand, tag, or material..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-800 rounded-xl text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="btn-amber-gradient px-5 py-2 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-orange-500/20"
          >
            Search
          </button>
        </form>
      </div>

      {/* 2-Column Search Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Filter Sidebar */}
        <FilterSidebar
          availableBrands={filterOptions.brands}
          availableSizes={filterOptions.sizes}
          availableColors={filterOptions.colors}
          minPriceLimit={filterOptions.minPrice}
          maxPriceLimit={filterOptions.maxPrice}
        />

        {/* Right: Products Area */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200 dark:border-zinc-800/80">
            <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400">
              Showing <strong className="text-stone-900 dark:text-white">{result.products.length}</strong> of{" "}
              <strong className="text-stone-900 dark:text-white">{result.total}</strong> matching items
            </span>
          </div>

          <ProductGrid
            products={result.products}
            columns={3}
            resetHref="/search"
            emptyTitle={`No items found for "${query}"`}
            emptyMessage="Try checking your spelling, using more general terms, or adjusting your filter settings."
          />
        </div>
      </div>
    </div>
  );
}
