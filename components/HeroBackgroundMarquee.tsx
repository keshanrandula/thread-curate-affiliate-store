import React from "react";

interface HeroBackgroundMarqueeProps {
  /** Optional custom product images to blend into the marquee */
  productImages?: string[];
}

const CURATED_LOOKBOOK: string[] = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=75",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=75",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=75",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=75",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=75",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=75",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=75",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=75",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&q=75",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=500&q=75",
  "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=75",
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=500&q=75",
];

export function HeroBackgroundMarquee({ productImages = [] }: HeroBackgroundMarqueeProps) {
  // Combine real store product images with curated editorial lookbook images
  const validProductImages = productImages.filter(
    (img) => Boolean(img) && typeof img === "string" && img.startsWith("http")
  );

  const pool = Array.from(new Set([...validProductImages, ...CURATED_LOOKBOOK]));

  // Split into two distinct rows
  const mid = Math.ceil(pool.length / 2);
  const row1 = pool.slice(0, mid);
  const row2 = pool.slice(mid);

  // Fallback if small pool
  const fullRow1 = row1.length >= 4 ? row1 : [...row1, ...CURATED_LOOKBOOK.slice(0, 4)];
  const fullRow2 = row2.length >= 4 ? row2 : [...row2, ...CURATED_LOOKBOOK.slice(4, 8)];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* Container with a slight architectural angle for dynamic motion */}
      <div className="absolute inset-0 flex flex-col justify-center gap-4 sm:gap-6 -rotate-2 scale-105 opacity-[0.14] dark:opacity-[0.12] transition-opacity">
        {/* ROW 1: Scrolling Left (Forward) */}
        <div className="flex overflow-hidden">
          <div className="animate-hero-marquee-forward flex items-center gap-4 sm:gap-6">
            {/* Duplicated 2x for seamless continuous infinite loop */}
            {[...fullRow1, ...fullRow1].map((src, idx) => (
              <div
                key={`row1-${idx}-${src.slice(-10)}`}
                className="w-28 h-40 sm:w-44 sm:h-60 md:w-52 md:h-72 shrink-0 rounded-2xl overflow-hidden border border-stone-800/20 dark:border-white/15 bg-stone-200/50 dark:bg-stone-900/50 shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover grayscale contrast-110 brightness-95"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Scrolling Right (Reverse) */}
        <div className="flex overflow-hidden">
          <div className="animate-hero-marquee-reverse flex items-center gap-4 sm:gap-6">
            {/* Duplicated 2x for seamless continuous infinite loop */}
            {[...fullRow2, ...fullRow2].map((src, idx) => (
              <div
                key={`row2-${idx}-${src.slice(-10)}`}
                className="w-28 h-40 sm:w-44 sm:h-60 md:w-52 md:h-72 shrink-0 rounded-2xl overflow-hidden border border-stone-800/20 dark:border-white/15 bg-stone-200/50 dark:bg-stone-900/50 shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover grayscale contrast-110 brightness-95"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Soft Radial Glow Mask - Keeps text perfectly readable & crisp */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,246,238,0.92)_20%,rgba(250,246,238,0.65)_55%,transparent_85%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(12,10,9,0.92)_20%,rgba(12,10,9,0.65)_55%,transparent_85%)]" />

      {/* Edge Fades: Top, Bottom, Left, and Right soft fade to blend into background */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#faf6ee] via-[#faf6ee]/80 to-transparent dark:from-[#0c0a09] dark:via-[#0c0a09]/80 dark:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#faf6ee] via-[#faf6ee]/80 to-transparent dark:from-[#0c0a09] dark:via-[#0c0a09]/80 dark:to-transparent" />
      <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#faf6ee] to-transparent dark:from-[#0c0a09] dark:to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#faf6ee] to-transparent dark:from-[#0c0a09] dark:to-transparent" />
    </div>
  );
}
