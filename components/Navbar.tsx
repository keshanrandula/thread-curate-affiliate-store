"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  Menu,
  X,
  Heart,
  ChevronDown,
  ArrowRight,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { useWishlist } from "./WishlistProvider";
import { ThemeToggle } from "./ThemeToggle";

export interface NavCategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export function Navbar({
  categories = [],
  siteName = "THREAD & CURATE",
}: {
  categories?: NavCategory[];
  siteName?: string;
}) {
  const router = useRouter();
  const { wishlistCount, setIsDrawerOpen } = useWishlist();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 180);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-stone-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {siteName}
              </span>
              <span className="text-[9px] text-amber-600 dark:text-amber-300/80 font-bold tracking-widest uppercase">
                Curated Fashion
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links & Category Mega Menu */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/shop"
              className="px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800/60 transition-colors uppercase tracking-wider"
            >
              All Deals
            </Link>

            {/* Category Mega Menu Hover Trigger */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors uppercase tracking-wider flex items-center gap-1 ${
                  isMegaMenuOpen
                    ? "text-stone-900 bg-stone-100 dark:text-white dark:bg-zinc-800"
                    : "text-stone-700 hover:text-stone-900 hover:bg-stone-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/60"
                }`}
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-400" />
              </button>

              {/* Mega Menu Dropdown */}
              {isMegaMenuOpen && (
                <div className="absolute top-full left-0 w-[580px] bg-white/95 dark:bg-zinc-950/95 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-xl dark:shadow-2xl p-6 backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id || cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="group/item flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-zinc-900 border border-transparent hover:border-stone-200 dark:hover:border-zinc-800 transition-all"
                      >
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-stone-100 dark:bg-zinc-900 shrink-0 border border-stone-200 dark:border-zinc-800">
                          {cat.image ? (
                            <Image
                              src={cat.image}
                              alt={cat.name}
                              fill
                              sizes="48px"
                              className="object-cover group-hover/item:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400 dark:text-zinc-600 text-xs">
                              {cat.name[0]}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-stone-900 dark:text-white group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400 transition-colors">
                            {cat.name}&apos;s Collection
                          </p>
                          <p className="text-[11px] text-stone-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                            {cat.description || "Explore curated pieces"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Mega Menu Footer Banner */}
                  <div className="mt-4 pt-4 border-t border-stone-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-stone-500 dark:text-zinc-400 text-[11px]">
                      Hand-verified apparel from Zara, Nike, Everlane &amp; Amazon
                    </span>
                    <Link
                      href="/shop"
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 flex items-center gap-1"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Category Links */}
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat._id || cat.slug}
                href={`/category/${cat.slug}`}
                className="px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800/60 transition-colors uppercase tracking-wider"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Search, Wishlist, Theme Toggle & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Input Desktop */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-stone-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search jackets, boots, dresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 lg:w-56 pl-8 pr-3 py-1.5 text-xs bg-stone-100/90 dark:bg-zinc-900/90 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 rounded-full border border-stone-200 dark:border-zinc-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all"
              />
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="sm:hidden p-2 text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800/60 transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Theme Toggle Button (Desktop & Mobile) */}
            <ThemeToggle />

            {/* Wishlist Heart Button with Counter */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-stone-700 hover:text-amber-600 dark:text-zinc-300 dark:hover:text-amber-400 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800/60 border border-stone-200 dark:border-zinc-800/80 transition-colors"
              aria-label="View wishlist"
              title="Open Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black flex items-center justify-center animate-in zoom-in shadow-sm shadow-orange-500/50">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard shortcut */}
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-amber-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 hover:border-amber-400/50 dark:text-zinc-300 dark:hover:text-amber-300 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-800 dark:hover:border-amber-500/40 rounded-xl transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Admin</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 dark:text-zinc-300 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800/60 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Expandable */}
        {isSearchOpen && (
          <form onSubmit={handleSearchSubmit} className="sm:hidden pb-3 pt-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search curated fashion deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2 text-xs bg-stone-100 dark:bg-zinc-900 text-stone-900 dark:text-white rounded-xl border border-stone-200 dark:border-zinc-800 focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>
          </form>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 dark:bg-zinc-950/98 border-b border-stone-200 dark:border-zinc-800 px-5 pt-3 pb-6 space-y-4 backdrop-blur-2xl shadow-xl transition-colors">
          <div className="flex flex-col space-y-1">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-bold text-stone-900 dark:text-white hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-lg uppercase tracking-wider"
            >
              All Deals Catalog
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id || cat.slug}
                href={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-medium text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-lg"
              >
                {cat.name} Collection
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-zinc-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsDrawerOpen(true);
              }}
              className="w-full px-3 py-2 text-xs text-left text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-lg flex items-center justify-between font-medium"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>My Wishlist</span>
              </span>
              <span className="text-[10px] bg-stone-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-stone-600 dark:text-zinc-400 font-semibold">
                {wishlistCount} items
              </span>
            </button>

            <Link
              href="/disclosure"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              FTC Affiliate Disclosure
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-lg flex items-center justify-between"
            >
              <span>Merchant Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
