import React from "react";

export interface BrandLogoProps {
  /** Size preset or numeric icon size in px (defaults to 'md') */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  /** Whether to show the text wordmark alongside the icon (defaults to true) */
  showWordmark?: boolean;
  /** Custom brand title (defaults to "THREAD & CURATE") */
  siteName?: string;
  /** Subtitle / Tagline text below title */
  subtitle?: string;
  /** Visual variant */
  variant?: "default" | "minimal" | "admin" | "footer";
  /** Optional custom className for the outer container */
  className?: string;
  /** Whether icon has interactive hover scale */
  animated?: boolean;
}

export function BrandLogoIcon({
  size = 40,
  className = "",
  _glow = true,
}: {
  size?: number;
  className?: string;
  _glow?: boolean;
}) {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
        aria-hidden="true"
      >
        <defs>
          {/* Main Luxury Amber/Orange Gradient */}
          <linearGradient
            id="tc-brand-gradient"
            x1="4"
            y1="4"
            x2="44"
            y2="44"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="45%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          {/* Golden Rim Accent */}
          <linearGradient
            id="tc-rim-gradient"
            x1="8"
            y1="4"
            x2="40"
            y2="44"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0.6" />
          </linearGradient>

          {/* Golden Thread Ribbon Gradient */}
          <linearGradient
            id="tc-thread-gold"
            x1="12"
            y1="12"
            x2="36"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="40%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>

          {/* Soft Drop Shadow for Emblem Depth */}
          <filter id="tc-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#7C2D12" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Squircle Badge Background */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="12"
          fill="url(#tc-brand-gradient)"
        />

        {/* Metallic Gold Border Highlight */}
        <rect
          x="3.5"
          y="3.5"
          width="41"
          height="41"
          rx="11.5"
          stroke="url(#tc-rim-gradient)"
          strokeWidth="1.2"
        />

        {/* Inner Subtle Textile Weave Grid Accents */}
        <path
          d="M7 16H41M7 32H41M16 7V41M32 7V41"
          stroke="#FFFFFF"
          strokeOpacity="0.06"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* --- BESPOKE "THREAD & CURATE" MONOGRAM EMBLEM --- */}
        <g filter="url(#tc-glow)">
          {/* Continuous Woven "T" Strand (Thread Needle & Top Bar) */}
          {/* Top T-Bar with styled rounded ends */}
          <path
            d="M 13 16.5 C 13 15.67 13.67 15 14.5 15 H 31.5 C 32.33 15 33 15.67 33 16.5 C 33 17.33 32.33 18 31.5 18 H 25.5 V 28.5 C 25.5 31.5 28 32.5 30 31.5 C 30.7 31.15 31.2 31.7 30.9 32.4 C 29.5 35 23.5 35 22.5 30 V 18 H 14.5 C 13.67 18 13 17.33 13 16.5 Z"
            fill="url(#tc-thread-gold)"
          />

          {/* The Interlocking "C" Ribbon (Curate) Weaving Through the Thread */}
          <path
            d="M 33 21.5 C 33.5 22.2 33.1 23 32.2 23.2 C 29.5 23.8 28.5 25 28.5 27 C 28.5 29.8 30.5 31 33 30.5 C 33.8 30.3 34.3 31.1 33.8 31.8 C 30.8 35.5 22 34 20.5 28 C 19.2 23 23.5 18.5 30.5 18.5 C 32 18.5 33.5 19 34.2 19.5 C 34.8 20 34.6 20.8 33.9 21.2 L 33 21.5 Z"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />

          {/* Central Golden Thread Needle Eye (Stitch Accent) */}
          <ellipse
            cx="24"
            cy="16.5"
            rx="1.2"
            ry="2"
            fill="#7C2D12"
            fillOpacity="0.45"
          />

          {/* Artisan 4-Point Curation Sparkle (Top-Right Seal) */}
          <path
            d="M 35 8 C 35 11 38 11 38 11 C 38 11 35 11 35 14 C 35 11 32 11 32 11 C 32 11 35 11 35 8 Z"
            fill="#FEF3C7"
          />
          <circle cx="35" cy="11" r="0.75" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}

export function BrandLogo({
  size = "md",
  showWordmark = true,
  siteName = "THREAD & CURATE",
  subtitle = "Curated Fashion",
  variant = "default",
  className = "",
  animated = true,
}: BrandLogoProps) {
  // Map size to icon pixel dimensions
  const iconPixelSize =
    typeof size === "number"
      ? size
      : {
          xs: 28,
          sm: 34,
          md: 40,
          lg: 48,
          xl: 56,
        }[size] || 40;

  // Determine text sizes based on size
  const titleClass =
    typeof size === "number" || size === "md"
      ? "text-base sm:text-lg"
      : size === "sm" || size === "xs"
      ? "text-sm sm:text-base"
      : "text-lg sm:text-xl";

  const subtitleClass =
    size === "xs" || size === "sm"
      ? "text-[8px] tracking-[0.18em]"
      : "text-[9px] sm:text-[10px] tracking-[0.2em]";

  // Handle special variants
  const isFooter = variant === "footer";
  const isAdmin = variant === "admin";

  return (
    <div
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}
    >
      {/* Dynamic Animated Logo Icon */}
      <div
        className={`relative transition-transform duration-300 ease-out ${
          animated ? "group-hover:scale-105 group-hover:rotate-1" : ""
        }`}
      >
        <BrandLogoIcon size={iconPixelSize} />

        {/* Ambient Warm Golden Glow Underlay */}
        <div
          aria-hidden="true"
          className="absolute -inset-1 rounded-2xl bg-amber-500/20 dark:bg-amber-500/30 blur-md -z-10 group-hover:bg-amber-500/35 transition-colors"
        />
      </div>

      {/* Typography Wordmark */}
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors uppercase ${titleClass}`}
              style={{ letterSpacing: "-0.03em" }}
            >
              {siteName.split("&").map((part, index, arr) => (
                <React.Fragment key={index}>
                  {part}
                  {index < arr.length - 1 && (
                    <span className="text-amber-500 dark:text-amber-400 font-extrabold mx-0.5">
                      &amp;
                    </span>
                  )}
                </React.Fragment>
              ))}
            </span>
          </div>

          {subtitle && (
            <span
              className={`font-extrabold uppercase mt-1 ${subtitleClass} ${
                isAdmin
                  ? "text-amber-600 dark:text-amber-400"
                  : isFooter
                  ? "text-stone-500 dark:text-zinc-500"
                  : "text-amber-600/90 dark:text-amber-300/80"
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
