"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ArrowUpRight, Heart } from "lucide-react";
import { useWishlist } from "./WishlistProvider";
import { formatPrice } from "@/lib/utils";

export function WishlistDrawer() {
  const { wishlist, removeFromWishlist, isDrawerOpen, setIsDrawerOpen } = useWishlist();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDrawerOpen(false);
    };
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, setIsDrawerOpen]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-white dark:bg-zinc-950 border-l border-stone-200 dark:border-zinc-800 shadow-2xl flex flex-col transition-colors"
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <h2 className="font-bold text-sm tracking-tight text-stone-900 dark:text-white uppercase">
                    Your Wishlist ({wishlist.length})
                  </h2>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 dark:hover:text-white dark:hover:bg-zinc-900 rounded-lg transition-colors"
                  aria-label="Close wishlist drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-100 dark:divide-zinc-900">
                {wishlist.length > 0 ? (
                  wishlist.map((item) => (
                    <div key={item._id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                      {/* Thumbnail */}
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setIsDrawerOpen(false)}
                        className="relative w-20 h-24 rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-900 shrink-0 border border-stone-200 dark:border-zinc-800 group"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="80px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      {/* Info & Actions */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                              {item.brand}
                            </span>
                            <button
                              onClick={() => removeFromWishlist(item._id)}
                              className="text-stone-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400 p-1 transition-colors"
                              title="Remove from wishlist"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={() => setIsDrawerOpen(false)}
                            className="font-medium text-xs text-stone-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-300 line-clamp-2 transition-colors mt-0.5"
                          >
                            {item.title}
                          </Link>
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 dark:text-white">
                            {formatPrice(item.price, item.currency)}
                          </span>
                          <a
                            href={`/go/${item._id}`}
                            target="_blank"
                            rel="noopener noreferrer sponsored nofollow"
                            className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <span>Buy now</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex items-center justify-center text-stone-400 dark:text-zinc-500">
                      <Heart className="w-6 h-6 stroke-1" />
                    </div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-white">Your wishlist is empty</p>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-xs">
                      Tap the heart icon on any curated piece to save it for later review.
                    </p>
                    <Link
                      href="/shop"
                      onClick={() => setIsDrawerOpen(false)}
                      className="mt-2 px-4 py-2 bg-stone-100 dark:bg-zinc-900 hover:bg-stone-200 dark:hover:bg-zinc-800 text-xs text-stone-800 dark:text-white font-medium rounded-xl border border-stone-200 dark:border-zinc-800 transition-colors inline-block"
                    >
                      Explore Trending Deals
                    </Link>
                  </div>
                )}
              </div>

              {/* Footer */}
              {wishlist.length > 0 && (
                <div className="p-6 border-t border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950/60">
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 text-center mb-3">
                    Wishlist items are saved in your local browser storage.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full py-2.5 px-4 bg-white dark:bg-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-white text-xs font-semibold rounded-xl flex items-center justify-center transition-colors shadow-sm"
                  >
                    Continue Browsing
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
