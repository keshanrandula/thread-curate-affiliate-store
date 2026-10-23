"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ArrowUpRight, Heart } from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useWishlist } from "./WishlistProvider";

export interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    images: string[];
    price: number;
    comparePrice?: number | null;
    currency: string;
    brand: string;
    rating: number;
    affiliateUrl: string;
    affiliateNetwork: string;
    isFeatured?: boolean;
    category?: {
      name: string;
      slug: string;
    };
  };
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);
  const discount = calculateDiscount(product.price, product.comparePrice);

  const images = product.images && product.images.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
  ];
  const primaryImage = images[0];
  const secondaryImage = images.length > 1 ? images[1] : null;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      _id: product._id,
      title: product.title,
      slug: product.slug,
      brand: product.brand,
      price: product.price,
      comparePrice: product.comparePrice,
      currency: product.currency,
      image: primaryImage,
      affiliateUrl: product.affiliateUrl,
      affiliateNetwork: product.affiliateNetwork,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative flex flex-col bg-white dark:bg-zinc-900/40 rounded-2xl border border-stone-200/90 dark:border-zinc-800/60 overflow-hidden card-hover-lift hover:border-amber-400/60 dark:hover:border-zinc-700/80 transition-all duration-300 shadow-sm dark:shadow-none"
    >
      {/* Image Container with Hover Swap & Badges */}
      <div className="relative aspect-[3/4] w-full bg-stone-100 dark:bg-zinc-950 overflow-hidden select-none">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-center transition-all duration-700 ease-out ${
              secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"
            }`}
          />

          {/* Secondary Hover Image Swap (Zara / ASOS luxury feel) */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.title} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
            />
          )}
        </Link>

        {/* Floating Top Bar: Badges Left, Wishlist Heart Right */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between pointer-events-none z-10">
          {/* Left Badges */}
          <div className="flex flex-col gap-1.5 items-start">
            {discount && (
              <span className="badge-discount text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider">
                -{discount}%
              </span>
            )}
            {product.isFeatured && (
              <span className="badge-featured text-[9px] font-semibold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>

          {/* Interactive Wishlist Heart Button */}
          <button
            onClick={handleWishlistClick}
            type="button"
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md border transition-all duration-200 active:scale-90 shadow-sm ${
              isWishlisted
                ? "bg-rose-500/20 border-rose-500/40 text-rose-500"
                : "bg-white/80 dark:bg-zinc-950/70 border-stone-200 dark:border-zinc-700/50 text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900"
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform ${
                isWishlisted ? "fill-rose-500 scale-110" : "stroke-[2]"
              }`}
            />
          </button>
        </div>

        {/* Store network pill at bottom of image */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <span className="bg-white/90 dark:bg-zinc-950/80 backdrop-blur-md text-stone-700 dark:text-zinc-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-stone-200 dark:border-zinc-800 shadow-sm">
            {product.affiliateNetwork}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 p-4">
        {/* Brand & Rating */}
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-medium text-xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-stone-600 dark:text-zinc-300 text-[11px]">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`} className="block mb-2 group/title">
          <h3 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-zinc-100 group-hover/title:text-amber-600 dark:group-hover/title:text-amber-300 line-clamp-2 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Pricing & CTA */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-stone-100 dark:border-zinc-800/60">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-stone-900 dark:text-white tracking-tight">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-[11px] text-stone-400 dark:text-zinc-400 line-through">
                {formatPrice(product.comparePrice, product.currency)}
              </span>
            )}
          </div>

          <a
            href={`/go/${product._id}`}
            target="_blank"
            rel="noopener noreferrer sponsored nofollow"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all duration-200 active:scale-95 group/btn"
            title={`Check deal on ${product.affiliateNetwork}`}
          >
            <span>Buy now</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
