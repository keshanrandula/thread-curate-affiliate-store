import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Thread & Curate Affiliate Fashion Discovery",
  description: "Learn how we curate the best clothing deals from the world's leading brands.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Thread & Curate",
    description: "Learn how we curate the best clothing deals from the world's leading brands.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Independent Fashion Curation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          Curation Over Clutter
        </h1>
        <p className="text-base text-stone-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          The internet is saturated with fast-fashion noise and endless catalogs. Thread &amp; Curate
          filters through the chaos to bring you wardrobe essentials that stand the test of time.
        </p>
      </div>

      <div className="space-y-10 text-stone-700 dark:text-zinc-300 text-sm leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 space-y-3">
            <Layers className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">Niche-Agnostic Architecture</h2>
            <p className="text-xs text-stone-600 dark:text-zinc-400">
              While our initial debut spotlights men&apos;s, women&apos;s, kids&apos;, and accessories
              apparel, our platform is built from the ground up to support any curated retail vertical.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 space-y-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">Zero Direct Sales</h2>
            <p className="text-xs text-stone-600 dark:text-zinc-400">
              We focus 100% on finding genuine deals and presenting beautiful imagery. All purchases,
              payments, and deliveries are handled directly by the verified retailers you know and trust.
            </p>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-stone-200 dark:border-zinc-800 text-center space-y-4">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">Ready to Explore Today&apos;s Deals?</h2>
          <p className="text-xs text-stone-600 dark:text-zinc-400 max-w-md mx-auto">
            Discover 24+ handpicked garments, coats, denim, shoes, and luxury accessories.
          </p>
          <Link
            href="/shop"
            className="btn-amber-gradient inline-flex items-center gap-2 px-6 py-3 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
