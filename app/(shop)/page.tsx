import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  getCategories,
  getFeaturedProducts,
  getTrendingDeals,
  getNewArrivals,
  getSiteSettings,
} from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductCarousel } from "@/components/ProductCarousels";
import { ValueProps } from "@/components/ValueProps";
import { NewsletterSection } from "@/components/NewsletterSection";

export default async function HomePage() {
  const [categories, featuredProducts, trendingProducts, newArrivals, settings] =
    await Promise.all([
      getCategories(),
      getFeaturedProducts(8),
      getTrendingDeals(8),
      getNewArrivals(8),
      getSiteSettings(),
    ]);

  return (
    <div className="relative overflow-hidden">
      {/* Radiant Glow Background Accent */}
      <div className="radiant-glow" />

      {/* --- HERO BANNER (Editable via SiteSettings) --- */}
      <section className="relative pt-12 sm:pt-20 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Curated Apparel &amp; Verified Merchant Partnerships</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-white leading-[1.1]">
            Curated Style,{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Handpicked Deals
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {settings.heroSubtitle ||
              "Discover premier fashion and wardrobe essentials across the world's best designer brands and verified retailers."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/shop"
              className="btn-amber-gradient px-7 py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center gap-2 group transition-all"
            >
              <span>Explore All Deals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
            </Link>
            <a
              href="#categories"
              className="px-6 py-3.5 rounded-xl bg-white dark:bg-zinc-900/90 hover:bg-stone-100 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-800 hover:border-amber-500/40 text-stone-800 dark:text-zinc-200 font-semibold text-xs sm:text-sm shadow-sm transition-all"
            >
              Browse Categories
            </a>
          </div>
        </div>
      </section>

      {/* --- VALUE PROPS STRIP --- */}
      <ValueProps />

      {/* --- FEATURED CATEGORIES GRID --- */}
      <section id="categories" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category) => (
            <Link
              key={category._id || category.slug}
              href={`/category/${category.slug}`}
              className="group relative h-80 rounded-2xl overflow-hidden border border-stone-200 dark:border-zinc-800/80 shadow-md dark:shadow-lg card-hover-lift"
            >
              <Image
                src={
                  category.image ||
                  "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
                }
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  Department
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-1 mt-1">
                  {category.description}
                </p>
                <div className="mt-3 flex items-center text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 text-amber-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- "TRENDING NOW" CAROUSEL --- */}
      <ProductCarousel
        title="Trending Now"
        subtitle="The most clicked and verified fashion discounts across global retailers today."
        icon="flame"
        products={trendingProducts}
        viewAllHref="/shop?sort=popular"
      />

      {/* --- "NEW ARRIVALS" CAROUSEL --- */}
      <ProductCarousel
        title="New Arrivals"
        subtitle="Freshly Scouted seasonal essentials and newly released designer drops."
        icon="sparkles"
        products={newArrivals}
        viewAllHref="/shop?sort=newest"
      />

      {/* --- FEATURED PRODUCTS GRID --- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/20 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Editor&apos;s Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
              Featured Wardrobe Highlights
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 mt-1">
              Top-rated apparel and footwear vetted for craftsmanship, style, and deal value.
            </p>
          </div>
          <Link
            href="/shop"
            className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-800 text-xs font-semibold text-stone-800 dark:text-zinc-200 shadow-sm transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product as any} />
          ))}
        </div>
      </section>

      {/* --- NEWSLETTER SIGNUP --- */}
      <NewsletterSection />
    </div>
  );
}
