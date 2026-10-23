import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { getCategoryBySlug, getProducts, getFilterOptions } from "@/lib/api";
import { ProductGrid } from "@/components/ProductGrid";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BreadcrumbListJsonLd } from "@/components/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const canonicalUrl = `/category/${category.slug}`;
  const images = category.image ? [{ url: category.image, alt: category.name }] : [];

  return {
    title: `${category.name} Collection | Handpicked Fashion Deals`,
    description: category.description || `Browse verified deals and essentials in ${category.name}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.name} Collection | Thread & Curate`,
      description: category.description || `Explore ${category.name} apparel and deals.`,
      url: canonicalUrl,
      images,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} Collection | Thread & Curate`,
      description: category.description,
      images: category.image ? [category.image] : [],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
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
  const { slug } = await params;
  const resolvedParams = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const currentPage = Number(resolvedParams.page) || 1;

  const [filterOptions, result] = await Promise.all([
    getFilterOptions(slug),
    getProducts({
      categorySlug: slug,
      brand: resolvedParams.brand,
      minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
      maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
      size: resolvedParams.size,
      color: resolvedParams.color,
      rating: resolvedParams.rating ? Number(resolvedParams.rating) : undefined,
      sort: (resolvedParams.sort as any) || "newest",
      page: currentPage,
      limit: 12,
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category JSON-LD Breadcrumbs */}
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Collections", url: "/shop" },
          { name: category.name, url: `/category/${category.slug}` },
        ]}
        siteUrl={siteUrl}
      />

      {/* Accessible Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Collections", href: "/shop" },
          { label: category.name },
        ]}
      />

      {/* Category Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-zinc-800 bg-stone-900 dark:bg-zinc-950 p-8 sm:p-12 mb-10 shadow-lg dark:shadow-2xl">
        {category.image && (
          <div className="absolute inset-0 z-0 opacity-25">
            <Image
              src={category.image}
              alt={category.name}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Apparel</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {category.name}&apos;s Wardrobe
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
            {category.description ||
              `Explore verified deals, premium staples, and seasonal apparel handpicked for ${category.name}.`}
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout: Sidebar + Product Grid */}
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
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200 dark:border-zinc-800/80">
            <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400">
              Showing <strong className="text-stone-900 dark:text-white">{result.products.length}</strong> of{" "}
              <strong className="text-stone-900 dark:text-white">{result.total}</strong> products
            </span>
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={result.products}
            columns={3}
            resetHref={`/category/${slug}`}
            emptyTitle={`No ${category.name} items found`}
            emptyMessage="No pieces matched your selected filter combinations. Try resetting filters."
          />

          {/* Pagination Controls */}
          {result.totalPages > 1 && (
            <div className="pt-10 flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/category/${slug}?page=${currentPage - 1}`}
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
                  href={`/category/${slug}?page=${currentPage + 1}`}
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
