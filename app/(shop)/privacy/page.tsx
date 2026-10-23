import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, Cookie } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy | Thread & Curate",
  description:
    "Learn how we respect your privacy, utilize local storage for your wishlist, and handle affiliate tracking cookies.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Thread & Curate",
    description: "Learn how we respect your privacy, wishlist storage, and affiliate cookies.",
    url: "/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Data Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 max-w-xl mx-auto">
          Last updated: October 2025. Your privacy is paramount to our mission.
        </p>
      </div>

      <div className="space-y-8 bg-white/80 dark:bg-zinc-900/60 p-8 sm:p-12 rounded-3xl border border-stone-200 dark:border-zinc-800 text-xs sm:text-sm text-stone-700 dark:text-zinc-300 leading-relaxed shadow-sm dark:shadow-xl transition-colors">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>1. Information We Do Not Collect</span>
          </h2>
          <p>
            Thread &amp; Curate does not sell products directly. We do not require visitors to create
            accounts to browse products, and we never collect, store, or process credit cards, billing
            addresses, or payment credentials.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-stone-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Cookie className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>2. Local Storage &amp; Wishlist Data</span>
          </h2>
          <p>
            When you tap the heart icon on a product, the item is saved exclusively within your web
            browser&apos;s <code>localStorage</code>. This data never leaves your device and is not sent to
            our servers. You can clear your wishlist anytime through the wishlist drawer or your browser
            settings.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-stone-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>3. Outbound Affiliate Links &amp; Retailer Cookies</span>
          </h2>
          <p>
            When you click &ldquo;Buy now&rdquo;, you are routed through our tracking redirect (<code>/go/[id]</code>)
            which records the timestamp, referring page, and user agent to monitor broken links and
            affiliate commission attribution. Once redirected to the retailer&apos;s site (e.g. Amazon, ASOS,
            Nike), that merchant&apos;s respective privacy policy and tracking cookies apply.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-stone-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-stone-900 dark:text-white">4. Contact &amp; Rights</h2>
          <p>
            If you have any questions regarding our privacy practices or wish to inquire about data
            retention, please reach out to us via our{" "}
            <Link href="/contact" className="text-amber-600 dark:text-amber-400 hover:underline">
              Contact Page
            </Link>{" "}
            or email <code>editorial@threadandcurate.com</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
