import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star,
  ArrowUpRight,
  RotateCcw,
  Tag,
  CheckCircle2,
  Info,
} from "lucide-react";
import { getProductBySlug } from "@/lib/api";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { AttributeChips } from "@/components/AttributeChips";
import { Breadcrumbs, BreadcrumbItem } from "@/components/Breadcrumbs";
import { ProductJsonLd, BreadcrumbListJsonLd } from "@/components/StructuredData";
import { formatPrice, calculateDiscount } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductBySlug(slug);

  if (!data?.product) {
    return { title: "Product Not Found" };
  }

  const { product } = data;
  const cleanTitle = `${product.title} - ${product.brand}`;
  const cleanDesc = product.description
    ? product.description.slice(0, 160)
    : `Shop the verified deal on ${product.title} by ${product.brand}. Handpicked affiliate curation.`;
  const canonicalUrl = `/product/${product.slug}`;
  const images = product.images && product.images.length > 0
    ? product.images.map((img: string) => ({ url: img, alt: product.title }))
    : [];

  return {
    title: cleanTitle,
    description: cleanDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.title} | ${product.brand}`,
      description: cleanDesc,
      url: canonicalUrl,
      images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDesc,
      images: product.images || [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);

  if (!data?.product) {
    notFound();
  }

  const { product, related } = data;
  const discount = calculateDiscount(product.price, product.comparePrice);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Products", href: "/shop" },
  ];
  if (product.category) {
    breadcrumbItems.push({
      label: product.category.name,
      href: `/category/${product.category.slug}`,
    });
  }
  breadcrumbItems.push({ label: product.title });

  const breadcrumbSchemaItems = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/shop" },
  ];
  if (product.category) {
    breadcrumbSchemaItems.push({
      name: product.category.name,
      url: `/category/${product.category.slug}`,
    });
  }
  breadcrumbSchemaItems.push({
    name: product.title,
    url: `/product/${product.slug}`,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Google Rich Snippet JSON-LD */}
      <ProductJsonLd product={product} siteUrl={siteUrl} />
      <BreadcrumbListJsonLd items={breadcrumbSchemaItems} siteUrl={siteUrl} />

      {/* Accessible Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Product Hero Grid: 7 cols Gallery, 5 cols Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Gallery with Coordinate Zoom & Lightbox */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images}
            title={product.title}
            discount={discount}
          />
        </div>

        {/* Right: Purchasing & Details Box */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Brand & Rating */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {product.brand}
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)} / 5.0</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/25 dark:border-amber-500/20 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-base text-stone-400 dark:text-zinc-400 line-through">
                  {formatPrice(product.comparePrice, product.currency)}
                </span>
              )}
              {discount && (
                <span className="badge-discount text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Save {discount}%
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600 dark:text-zinc-400">
              Verified deal available via <strong className="text-amber-700 dark:text-amber-300">{product.affiliateNetwork}</strong>.
            </p>
          </div>

          {/* Interactive Attribute Chips (Sizes & Colors) */}
          <AttributeChips attributes={product.attributes} />

          {/* Prominent CTA: Buy now on External Affiliate Merchant */}
          <div className="space-y-3 pt-2">
            <a
              href={`/go/${product._id}`}
              target="_blank"
              rel="noopener noreferrer sponsored nofollow"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-base shadow-xl shadow-orange-500/30 flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] group"
            >
              <span>Buy now on {product.affiliateNetwork}</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>

            {/* Contextual FTC Disclosure Note */}
            <div className="p-3 rounded-xl bg-stone-100 dark:bg-zinc-900/50 border border-stone-200 dark:border-zinc-800 text-[11px] text-stone-600 dark:text-zinc-400 flex items-start gap-2 leading-relaxed">
              <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Affiliate Note:</strong> You will be safely redirected to the verified retailer checkout. We may receive a small referral commission at no additional cost to you.
              </span>
            </div>
          </div>

          {/* Value Props Strip */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200 dark:border-zinc-800/80">
            <div className="flex items-center gap-2 text-xs text-stone-700 dark:text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Authentic Guaranteed</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-700 dark:text-zinc-300">
              <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Merchant Return Policy</span>
            </div>
          </div>

          {/* Description */}
          <div className="pt-4 space-y-2 border-t border-stone-200 dark:border-zinc-800/80">
            <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              About This Piece
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="pt-4 space-y-2 border-t border-stone-200 dark:border-zinc-800/80">
              <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                Specifications
              </h2>
              <div className="bg-stone-50 dark:bg-zinc-900/60 rounded-xl border border-stone-200 dark:border-zinc-800 divide-y divide-stone-200 dark:divide-zinc-800/60 overflow-hidden text-xs">
                {Object.entries(product.attributes).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-3">
                    <span className="font-medium text-stone-500 dark:text-zinc-400">{key}</span>
                    <span className="text-stone-900 dark:text-zinc-200 font-semibold text-right">
                      {Array.isArray(val) ? val.join(", ") : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="pt-4 flex flex-wrap items-center gap-2 border-t border-stone-200 dark:border-zinc-800/80">
              <Tag className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-400" />
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-zinc-900 text-stone-600 dark:text-zinc-400 text-xs border border-stone-200 dark:border-zinc-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Grid */}
      {related.length > 0 && (
        <section className="mt-20 sm:mt-24 pt-12 border-t border-stone-200 dark:border-zinc-800/80">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">You Might Also Like</h2>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                More handpicked recommendations from {product.category?.name || "our catalog"}.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((item: any) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
