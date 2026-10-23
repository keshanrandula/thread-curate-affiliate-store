import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, getFilterOptions } from "@/lib/api";
import { ProductGrid } from "@/components/ProductGrid";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Shop All Deals | Curated Fashion & Clothing Affiliate Store",
  description:
    "Explore our full catalog of handpicked clothes, outerwear, denim, footwear, and designer accessories.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop All Deals | Curated Fashion & Clothing",
    description:
      "Explore handpicked clothes, outerwear, denim, and designer accessories with verified deals.",
    url: "/shop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Deals | Curated Fashion & Clothing",
    description: "Explore our full catalog of handpicked clothes and designer accessories.",
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string;
    color?: string;
    rating?: string;
    sort?: string;
    page?: string;
    q?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;

  const [filterOptions, result] = await Promise.all([
    getFilterOptions(resolvedParams.category),
    getProducts({
      categorySlug: resolvedParams.category,
      brand: resolvedParams.brand,
      minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
      maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
      size: resolvedParams.size,
      color: resolvedParams.color,
      rating: resolvedParams.rating ? Number(resolvedParams.rating) : undefined,
      sort: (resolvedParams.sort as any) || "newest",
      query: resolvedParams.q,
      page: currentPage,
      limit: 12,
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "All Deals Catalog" }]} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-100 via-white to-amber-100/50 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-amber-950/20 border border-stone-200 dark:border-amber-500/20 rounded-3xl p-6 sm:p-10 mb-10 shadow-lg dark:shadow-xl space-y-2 transition-colors">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 dark:border-amber-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>Curated Apparel Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          All Fashion Deals
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 max-w-xl">
          Verified designer apparel, premium denim, knitwear, and accessories from global fashion houses.
        </p>
      </div>

      {/* 2-Column Catalog Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Filter Sidebar */}
        <FilterSidebar
          availableBrands={filterOptions.brands}
          availableSizes={filterOptions.sizes}
          availableColors={filterOptions.colors}
          minPriceLimit={filterOptions.minPrice}
          maxPriceLimit={filterOptions.maxPrice}
        />

        {/* Right: Products Grid */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200 dark:border-zinc-800/80">
            <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400">
              Showing <strong className="text-stone-900 dark:text-white">{result.products.length}</strong> of{" "}
              <strong className="text-stone-900 dark:text-white">{result.total}</strong> products
            </span>
          </div>

          <ProductGrid
            products={result.products}
            columns={3}
            resetHref="/shop"
          />

          {/* Pagination */}
          {result.totalPages > 1 && (
            <div className="pt-10 flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/shop?page=${currentPage - 1}`}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-xs font-semibold text-stone-800 dark:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 shadow-sm transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Link>
              )}
              <span className="text-xs text-stone-500 dark:text-zinc-400 px-3 py-2 font-medium">
                Page {currentPage} of {result.totalPages}
              </span>
              {currentPage < result.totalPages && (
                <Link
                  href={`/shop?page=${currentPage + 1}`}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-xs font-semibold text-stone-800 dark:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 shadow-sm transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
