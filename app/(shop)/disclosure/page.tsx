import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Info, HeartHandshake, CheckCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "FTC Affiliate Disclosure & Editorial Policy | Thread & Curate",
  description:
    "Full transparency regarding our affiliate partnerships, commission disclosures, and curation integrity.",
  alternates: {
    canonical: "/disclosure",
  },
  openGraph: {
    title: "FTC Affiliate Disclosure & Editorial Policy | Thread & Curate",
    description: "Full transparency regarding our affiliate partnerships and commission disclosures.",
    url: "/disclosure",
    type: "website",
  },
};

export default async function DisclosurePage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Title */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Full Legal &amp; Editorial Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          Affiliate Disclosure &amp; Editorial Policy
        </h1>
        <p className="text-sm text-stone-600 dark:text-zinc-400 max-w-xl mx-auto">
          We believe in 100% transparency with our readers. Here is how Thread &amp; Curate earns
          money and how our curation process operates.
        </p>
      </div>

      <div className="space-y-8 text-sm text-stone-700 dark:text-zinc-300 leading-relaxed bg-white/80 dark:bg-zinc-900/50 p-8 sm:p-10 rounded-2xl border border-stone-200 dark:border-zinc-800 shadow-sm dark:shadow-xl transition-colors">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>FTC Compliance Disclosure</span>
          </h2>
          <p>
            In compliance with the Federal Trade Commission (FTC) guidelines, please assume that any
            links leading to products on Thread &amp; Curate are affiliate links. If you click on one
            of these links and make a purchase on an external merchant&apos;s website, we may earn an
            affiliate commission from the merchant.
          </p>
          <p className="font-semibold text-stone-900 dark:text-white bg-amber-500/10 dark:bg-indigo-950/40 p-4 rounded-xl border border-amber-500/20 dark:border-indigo-500/20">
            {settings.disclosureText}
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-stone-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Does This Cost You Anything?</span>
          </h2>
          <p>
            <strong>No, absolutely not.</strong> You do not pay a single penny extra by clicking on our
            links. The price you pay on the merchant&apos;s website (such as Amazon, Nike, ASOS,
            Nordstrom, or Everlane) is identical whether you use our link or navigate there
            independently. In fact, we actively curate and monitor discounts so you find the lowest
            available price.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-stone-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Our Editorial Integrity</span>
          </h2>
          <ul className="space-y-2 list-disc list-inside text-stone-700 dark:text-zinc-300">
            <li>
              <strong>Unbiased selection:</strong> Retailers and brands cannot pay us to feature
              products that fail our quality and styling standards.
            </li>
            <li>
              <strong>Verified merchants:</strong> We only redirect users to reputable, authenticated
              e-commerce storefronts with proven return policies and SSL security.
            </li>
            <li>
              <strong>No direct transactions:</strong> Thread &amp; Curate does not process credit
              cards, hold inventory, or handle shipping. Customer service, fulfillment, and refunds are
              handled directly by the merchant where you complete checkout.
            </li>
          </ul>
        </section>

        <div className="pt-6 border-t border-stone-200 dark:border-zinc-800 text-center">
          <Link
            href="/shop"
            className="btn-amber-gradient inline-block px-6 py-3 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors"
          >
            Return to Store &amp; Explore Deals &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
