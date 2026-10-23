import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Footer({
  siteName = "THREAD & CURATE",
  disclosureText,
  socialLinks = {},
}: {
  siteName?: string;
  disclosureText?: string;
  socialLinks?: Record<string, string>;
}) {
  return (
    <footer className="bg-[#f7f2e7] dark:bg-zinc-950 border-t border-amber-300/60 dark:border-zinc-800/80 text-stone-700 dark:text-zinc-400 text-sm mt-24 transition-colors">
      {/* FTC Notice Ribbon */}
      <div className="border-b border-amber-300/60 dark:border-zinc-900 bg-amber-100/50 dark:bg-zinc-900/40 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 text-xs text-stone-600 dark:text-zinc-400">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 shrink-0 font-semibold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>FTC Disclosure Statement</span>
          </div>
          <p className="leading-relaxed text-stone-600 dark:text-zinc-400/90 text-center md:text-left">
            {disclosureText ||
              "Thread & Curate is an independent product discovery platform. When you click our affiliate links and complete a purchase, we may receive a commission from retail partners (such as Amazon Associates, ASOS, Nike, Nordstrom, Awin, etc.) at no additional cost to you. Pricing and availability are subject to change."}{" "}
            <Link href="/disclosure" className="text-amber-600 dark:text-amber-400 hover:underline font-medium">
              Read our full editorial policy.
            </Link>
          </p>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-stone-900 dark:text-white text-base tracking-tight">{siteName}</span>
            </Link>
            <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
              Handpicking verified fashion deals, timeless apparel, and wardrobe staples from the
              world’s best online storefronts.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-stone-500 dark:text-zinc-400">
              <span>Niche-agnostic affiliate engine</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-stone-900 dark:text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Shop Categories
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/category/men" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Men&apos;s Collection
                </Link>
              </li>
              <li>
                <Link href="/category/women" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link href="/category/kids" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Kids &amp; Toddlers
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Accessories &amp; Gear
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium">
                  View All Deals &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Discovery */}
          <div>
            <h3 className="text-stone-900 dark:text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Transparency
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/disclosure" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  About Our Curation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Contact &amp; Partnerships
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>

            </ul>
          </div>

          {/* Col 4: Newsletter Mock */}
          <div>
            <h3 className="text-stone-900 dark:text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Deal Alerts
            </h3>
            <p className="text-xs text-stone-600 dark:text-zinc-400 mb-3">
              Get notified when top designer pieces drop below retail price.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                className="btn-amber-gradient text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-200 dark:border-zinc-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} {siteName}. All external product logos and brands are property of their respective owners.</p>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Built with precision &amp; modern Next.js</span>
            <div className="flex items-center gap-2 pl-2 sm:border-l border-stone-300 dark:border-zinc-800">
              <span className="text-[11px] text-stone-500 dark:text-zinc-400">Theme:</span>
              <ThemeToggle showMenu />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
