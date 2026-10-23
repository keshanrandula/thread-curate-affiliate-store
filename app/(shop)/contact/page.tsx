import type { Metadata } from "next";
import { Mail, MessageSquare, ShieldCheck, Send } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact Us | Thread & Curate",
  description:
    "Get in touch with our curation and editorial team for partnership inquiries or broken link reports.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Thread & Curate",
    description: "Get in touch with our curation and editorial team for partnership inquiries.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: "Contact Us" }]} />

      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Editorial &amp; Merchant Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          How Can We Help You?
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 max-w-lg mx-auto">
          Have an affiliate partnership proposal, spotted an expired deal, or want your apparel brand featured? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Form (7 cols) */}
        <div className="md:col-span-7 bg-white/80 dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-xl transition-colors">
          <form className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Your Full Name</label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Email Address</label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Inquiry Subject</label>
              <select className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer">
                <option value="partnership" className="bg-white dark:bg-zinc-900">Merchant / Affiliate Partnership</option>
                <option value="broken-link" className="bg-white dark:bg-zinc-900">Report Expired Deal or Broken Link</option>
                <option value="brand" className="bg-white dark:bg-zinc-900">Suggest a Designer Brand</option>
                <option value="other" className="bg-white dark:bg-zinc-900">General Inquiry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Message</label>
              <textarea
                rows={4}
                required
                placeholder="Please include product links or details..."
                className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="btn-amber-gradient w-full py-3 px-4 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

        {/* Sidebar Info (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 space-y-3">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Direct Email</span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
              For urgent affiliate inquiries or press correspondence, email our team directly:
            </p>
            <p className="text-xs font-mono text-amber-700 dark:text-amber-300 bg-stone-100 dark:bg-zinc-950 p-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 select-all">
              editorial@threadandcurate.com
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 space-y-3">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Deal Quality Guarantee</span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
              If a product price on our site differs from the merchant&apos;s checkout page, report it
              above and our crawler team will update it within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
