"use client";

import { useState, useTransition } from "react";
import {
  Save,
  Globe,
  Share2,
  ShieldCheck,
  Search,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { updateSettingsAction } from "@/server/actions/settings";
import { SingleImageUploader } from "@/components/SingleImageUploader";

interface Props {
  initialSettings: any;
}

export function AdminSettingsForm({ initialSettings }: Props) {
  const [isPending, startTransition] = useTransition();
  const [logoUrl, setLogoUrl] = useState(initialSettings?.logo || "");
  const [ogImageUrl, setOgImageUrl] = useState(initialSettings?.seoDefaults?.ogImage || "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const toastId = toast.loading("Saving site settings...");
      try {
        const res = await updateSettingsAction(formData);
        if (res && res.error) {
          toast.error(res.error, { id: toastId });
        } else {
          toast.success(res?.message || "Settings updated successfully!", { id: toastId });
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to update settings.", { id: toastId });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-amber-500" />
            <span>Store Configuration &amp; Compliance</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
            Global site branding, hero headlines, FTC affiliate disclosure, social networks, and SEO defaults.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn-amber-gradient px-4 py-2 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* 1. Branding & Logo */}
        <div className="bg-white/80 dark:bg-zinc-900/60 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800/80 space-y-4 shadow-sm dark:shadow-xl transition-colors">
          <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Brand Identity &amp; Logo</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Site Name *</label>
              <input
                type="text"
                name="siteName"
                defaultValue={initialSettings.siteName}
                required
                placeholder="e.g. THREAD & CURATE"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <SingleImageUploader
                name="logo"
                label="Store Logo Image"
                initialValue={logoUrl}
                onChange={(url) => setLogoUrl(url)}
                aspectRatio="square"
                placeholder="Upload logo file (SVG/PNG) or enter URL..."
              />
            </div>
          </div>
        </div>

        {/* 2. Hero Content */}
        <div className="bg-white/80 dark:bg-zinc-900/60 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800/80 space-y-4 shadow-sm dark:shadow-xl transition-colors">
          <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Storefront Hero Content</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Hero Headline *</label>
              <input
                type="text"
                name="heroTitle"
                defaultValue={initialSettings.heroTitle}
                required
                placeholder="Curated Style, Handpicked Deals"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Hero Subtitle *</label>
              <textarea
                name="heroSubtitle"
                defaultValue={initialSettings.heroSubtitle}
                rows={2}
                required
                placeholder="Discover verified luxury deals, apparel, and style essentials curated daily across world-class brands."
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* 3. FTC Legal Disclosure */}
        <div className="bg-white/80 dark:bg-zinc-900/60 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800/80 space-y-4 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              FTC Affiliate Legal Disclosure *
            </h2>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-zinc-400">
            Mandatory Federal Trade Commission notice shown across all pages, banners, product cards, and footers.
          </p>

          <textarea
            name="disclosureText"
            defaultValue={initialSettings.disclosureText}
            rows={3}
            required
            className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 leading-relaxed"
          />
        </div>

        {/* 4. Social Links */}
        <div className="bg-white/80 dark:bg-zinc-900/60 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800/80 space-y-4 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Social Media Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Instagram URL</label>
              <input
                type="url"
                name="social_instagram"
                defaultValue={initialSettings.socialLinks?.instagram}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Twitter / X URL</label>
              <input
                type="url"
                name="social_twitter"
                defaultValue={initialSettings.socialLinks?.twitter}
                placeholder="https://x.com/..."
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Pinterest URL</label>
              <input
                type="url"
                name="social_pinterest"
                defaultValue={initialSettings.socialLinks?.pinterest}
                placeholder="https://pinterest.com/..."
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">TikTok URL</label>
              <input
                type="url"
                name="social_tiktok"
                defaultValue={initialSettings.socialLinks?.tiktok}
                placeholder="https://tiktok.com/@..."
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* 5. SEO Defaults */}
        <div className="bg-white/80 dark:bg-zinc-900/60 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800/80 space-y-4 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Search Engine Optimization (SEO) Defaults
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Meta Title Template</label>
              <input
                type="text"
                name="metaTitle"
                defaultValue={initialSettings.seoDefaults?.metaTitle || "THREAD & CURATE | Verified Fashion Deals"}
                placeholder="THREAD & CURATE | Curated Clothes & Deals"
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Meta Description</label>
              <textarea
                name="metaDescription"
                defaultValue={
                  initialSettings.seoDefaults?.metaDescription ||
                  "Discover verified luxury deals, apparel, and style essentials curated daily."
                }
                rows={2}
                placeholder="Brief summary appearing on Google and search engine result snippets..."
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <SingleImageUploader
                name="ogImage"
                label="Default Social Sharing Image (OG Image)"
                initialValue={ogImageUrl}
                onChange={(url) => setOgImageUrl(url)}
                aspectRatio="banner"
                placeholder="Upload social share banner or enter image URL..."
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                SEO Keywords (Comma separated)
              </label>
              <input
                type="text"
                name="keywords"
                defaultValue={
                  initialSettings.seoDefaults?.keywords ||
                  "fashion, luxury deals, clothing, verified affiliate"
                }
                placeholder="fashion deals, clothes, discounts, affiliate shop"
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="btn-amber-gradient px-5 py-2.5 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? "Saving..." : "Save All Settings"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
