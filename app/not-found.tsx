import Link from "next/link";
import { Search, Sparkles, ArrowRight, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#fafaf9] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background radiant ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[420px] bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-lg w-full text-center space-y-8 z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>404 &bull; Page Out of Stock</span>
        </div>

        {/* 404 Headline */}
        <div className="space-y-3">
          <h1 className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-500/60 tracking-tighter">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Looks like this piece has been moved or archived
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-sm mx-auto leading-relaxed">
            The page or product you are looking for does not exist or may have expired. Search our verified deals below.
          </p>
        </div>

        {/* Quick Search Bar */}
        <form action="/search" method="GET" className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
          <input
            type="text"
            name="q"
            placeholder="Search clothes, brands, sweaters, footwear..."
            className="w-full pl-10 pr-24 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 shadow-xl"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1 btn-amber-gradient text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Popular Categories Quick Links */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2.5">
            Or browse popular collections:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "Men's Apparel", href: "/category/men" },
              { label: "Women's Collection", href: "/category/women" },
              { label: "Accessories", href: "/category/accessories" },
              { label: "Kids", href: "/category/kids" },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800/80 text-xs text-zinc-300 hover:text-amber-300 hover:border-amber-500/30 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-zinc-800/80">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 hover:border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-zinc-400" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-amber-gradient text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-white" />
            <span>Explore All Deals</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}
