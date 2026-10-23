"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Lock,
  Unlock,
  Plus,
  Trash2,
  ExternalLink,
  Tag,
  Bold,
  Italic,
  List,
  Eye,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { ImageUploaderWithDnd } from "@/components/ImageUploaderWithDnd";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialData?: any;
  action: (formData: FormData) => Promise<any> | void;
  title: string;
}

export function ProductForm({
  categories,
  initialData,
  action,
  title,
}: ProductFormProps) {
  const [isPending, startTransition] = useTransition();

  // Basic info & auto-slug
  const [productTitle, setProductTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugLocked, setIsSlugLocked] = useState(Boolean(initialData?.slug));

  // Description
  const [description, setDescription] = useState(initialData?.description || "");
  const [showPreview, setShowPreview] = useState(false);

  // Affiliate info
  const [affiliateNetwork, setAffiliateNetwork] = useState(
    initialData?.affiliateNetwork || "Amazon"
  );
  const [affiliateUrl, setAffiliateUrl] = useState(initialData?.affiliateUrl || "");

  // Tags chip input
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");

  // Dynamic Key-Value Attributes
  const initialAttributes = initialData?.attributes
    ? Object.entries(initialData.attributes).map(([key, value]) => ({
        key,
        value: typeof value === "object" ? JSON.stringify(value) : String(value),
      }))
    : [
        { key: "Material", value: "100% Cashmere" },
        { key: "Fit", value: "Regular" },
        { key: "Origin", value: "Imported" },
      ];

  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>(
    initialAttributes.length > 0 ? initialAttributes : [{ key: "", value: "" }]
  );

  // Toggles
  const [isPublished, setIsPublished] = useState(
    initialData ? Boolean(initialData.isPublished) : true
  );
  const [isFeatured, setIsFeatured] = useState(
    initialData ? Boolean(initialData.isFeatured) : false
  );

  const handleTitleChange = (val: string) => {
    setProductTitle(val);
    if (!isSlugLocked) {
      setSlug(slugify(val));
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().replace(/^#/, "");
    if (!tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addAttributeRow = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const updateAttributeRow = (
    index: number,
    field: "key" | "value",
    val: string
  ) => {
    const updated = [...attributes];
    updated[index][field] = val;
    setAttributes(updated);
  };

  const removeAttributeRow = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const getAttributesJson = () => {
    const obj: Record<string, string> = {};
    for (const attr of attributes) {
      if (attr.key.trim()) {
        obj[attr.key.trim()] = attr.value.trim();
      }
    }
    return JSON.stringify(obj);
  };

  const insertFormatting = (prefix: string, suffix: string = "") => {
    setDescription((prev: string) => `${prev}${prefix}Text${suffix}`);
  };

  const popularNetworks = [
    "Amazon",
    "ASOS",
    "Nike",
    "Nordstrom",
    "Everlane",
    "Zara",
    "ShareASale",
    "CJ Affiliate",
    "Impact",
    "Awin",
  ];

  return (
    <form
      action={async (formData: FormData) => {
        formData.set("tags", tags.join(","));
        formData.set("attributes", getAttributesJson());
        formData.set("isPublished", isPublished ? "true" : "false");
        formData.set("isFeatured", isFeatured ? "true" : "false");
        formData.set("affiliateNetwork", affiliateNetwork);

        startTransition(async () => {
          const toastId = toast.loading("Saving product to catalog...");
          try {
            const res = await action(formData);
            if (res && res.error) {
              toast.error(res.error, { id: toastId });
            } else {
              toast.success("Product saved successfully!", { id: toastId });
            }
          } catch (err: any) {
            if (err?.message?.includes("NEXT_REDIRECT")) return;
            toast.error(err.message || "Failed to save product.", { id: toastId });
          }
        });
      }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">{title}</h1>
            <p className="text-xs text-stone-500 dark:text-zinc-400">
              Configure product details, commission tracking URLs, and dynamic metadata.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn-amber-gradient px-4 py-2 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? "Saving..." : "Save Product"}</span>
        </button>
      </div>

      {/* Main Form Fields */}
      <div className="space-y-6">
        {/* 1. Basic Info Card */}
        <div className="bg-white/80 dark:bg-zinc-900/60 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800/80 space-y-4 shadow-sm dark:shadow-xl transition-colors">
          <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>General Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Product Title *</label>
              <input
                type="text"
                name="title"
                value={productTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="e.g. Italian Wool Relaxed Blazer"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Auto-slug with manual edit toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">URL Slug *</label>
                <button
                  type="button"
                  onClick={() => setIsSlugLocked(!isSlugLocked)}
                  className="text-[11px] text-stone-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                >
                  {isSlugLocked ? (
                    <>
                      <Lock className="w-3 h-3 text-amber-500" />
                      <span>Unlock manual edit</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3 text-emerald-500" />
                      <span>Lock auto-slug</span>
                    </>
                  )}
                </button>
              </div>
              <input
                type="text"
                name="slug"
                value={slug}
                readOnly={isSlugLocked}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="italian-wool-relaxed-blazer"
                className={`w-full px-3.5 py-2 rounded-xl text-xs ${
                  isSlugLocked
                    ? "border border-stone-200 dark:border-zinc-800 text-stone-500 dark:text-zinc-400 cursor-not-allowed bg-stone-100 dark:bg-zinc-950/60"
                    : "border border-amber-500 bg-white dark:bg-zinc-950 text-stone-900 dark:text-white focus:outline-none"
                }`}
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Category *</label>
              <select
                name="categoryId"
                defaultValue={initialData?.categoryId || categories[0]?._id}
                required
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id} className="bg-white dark:bg-zinc-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Brand Name *</label>
              <input
                type="text"
                name="brand"
                defaultValue={initialData?.brand}
                required
                placeholder="e.g. Everlane, Nike, Ralph Lauren"
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Verified Rating (0 - 5)</label>
              <input
                type="number"
                name="rating"
                step="0.1"
                min="0"
                max="5"
                defaultValue={initialData?.rating || 4.8}
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Rich Description */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                  Rich Product Description
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => insertFormatting("**", "**")}
                    className="p-1 text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white rounded hover:bg-stone-100 dark:hover:bg-zinc-800"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("*", "*")}
                    className="p-1 text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white rounded hover:bg-stone-100 dark:hover:bg-zinc-800"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("\n- ", "")}
                    className="p-1 text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white rounded hover:bg-stone-100 dark:hover:bg-zinc-800"
                    title="Bullet List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 ml-2 px-2 py-0.5 rounded bg-amber-500/10"
                  >
                    {showPreview ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPreview ? "Edit Mode" : "Preview"}</span>
                  </button>
                </div>
              </div>

              {showPreview ? (
                <div className="w-full min-h-[100px] p-3.5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs text-stone-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {description || "No description provided yet."}
                </div>
              ) : (
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Craftsmanship details, materials, tailoring, and fit advice..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              )}
            </div>
          </div>
        </div>

        {/* 2. Multiple Image Upload with Drag-to-Reorder */}
        <div className="bg-white/80 dark:bg-zinc-900/60 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800/80 space-y-4 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Product Images &amp; Gallery
            </h2>
            <span className="text-[11px] text-stone-500 dark:text-zinc-400">Drag to reorder photos</span>
          </div>

          <ImageUploaderWithDnd initialImages={initialData?.images || []} />
        </div>

        {/* 3. Pricing & Affiliate Destination */}
        <div className="bg-white/80 dark:bg-zinc-900/60 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800/80 space-y-4 shadow-sm dark:shadow-xl transition-colors">
          <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Pricing &amp; Outbound Affiliate Tracking</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Current Deal Price ($) *</label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                defaultValue={initialData?.price}
                required
                placeholder="89.00"
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Compare Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                Original / Compare Price ($)
              </label>
              <input
                type="number"
                name="comparePrice"
                step="0.01"
                min="0"
                defaultValue={initialData?.comparePrice ?? ""}
                placeholder="120.00 (optional)"
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Currency</label>
              <input
                type="text"
                name="currency"
                defaultValue={initialData?.currency || "USD"}
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Affiliate Network */}
            <div className="space-y-2 sm:col-span-3">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Affiliate Network *</label>
              <input
                type="text"
                name="affiliateNetwork"
                value={affiliateNetwork}
                onChange={(e) => setAffiliateNetwork(e.target.value)}
                required
                placeholder="e.g. Amazon, ASOS, Nike, Awin"
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              {/* Popular Network Quick Selectors */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-stone-500 dark:text-zinc-400">Quick select:</span>
                {popularNetworks.map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setAffiliateNetwork(net)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      affiliateNetwork === net
                        ? "btn-amber-gradient text-white"
                        : "bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>

            {/* Affiliate Destination URL */}
            <div className="space-y-1.5 sm:col-span-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                  Target Affiliate URL (with tracking tag) *
                </label>
                {affiliateUrl && (
                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Test Link</span>
                  </a>
                )}
              </div>
              <input
                type="url"
                name="affiliateUrl"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                required
                placeholder="https://amazon.com/dp/B08XYZ?tag=yourtag-20"
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* 4. Tags & Dynamic Key/Value Attributes */}
        <div className="bg-white/80 dark:bg-zinc-900/60 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800/80 space-y-5 shadow-sm dark:shadow-xl transition-colors">
          <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-500" />
            <span>Search Tags &amp; Dynamic Attributes</span>
          </h2>

          {/* Tags Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Tags / Keywords</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Type tag and press Enter (e.g. Wool, Winter, Luxury, Sale)..."
                className="flex-1 px-3.5 py-2 text-xs bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-amber-gradient px-4 py-2 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Add Tag
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="text-stone-400 hover:text-red-500 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Attributes Key/Value Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                  Dynamic Attribute Specifications (Key / Value)
                </label>
                <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                  Add custom product specifications like Material, Fit, Collar, Care, Origin.
                </p>
              </div>
              <button
                type="button"
                onClick={addAttributeRow}
                className="btn-amber-gradient px-3 py-1.5 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Attribute</span>
              </button>
            </div>

            <div className="space-y-2">
              {attributes.map((attr, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={attr.key}
                    onChange={(e) => updateAttributeRow(idx, "key", e.target.value)}
                    placeholder="Key (e.g. Material)"
                    className="w-1/3 px-3 py-1.5 text-xs bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => updateAttributeRow(idx, "value", e.target.value)}
                    placeholder="Value (e.g. 100% Merino Wool)"
                    className="flex-1 px-3 py-1.5 text-xs bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttributeRow(idx)}
                    className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                    title="Remove row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Publishing & Featured Toggles */}
        <div className="bg-white/80 dark:bg-zinc-900/60 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-6 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex items-center gap-8">
            {/* Publish Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-white block">Published</span>
                <span className="text-[10px] text-stone-500 dark:text-zinc-400">
                  Visible to shoppers on public catalog
                </span>
              </div>
            </label>

            {/* Featured Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-white block">Featured Product</span>
                <span className="text-[10px] text-stone-500 dark:text-zinc-400">
                  Promoted on homepage hero and top carousels
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn-amber-gradient px-5 py-2.5 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? "Saving..." : "Save Product"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
