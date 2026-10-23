"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowUpDown,
  Filter,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import {
  deleteProductAction,
  duplicateProductAction,
  bulkUpdateProductStatusAction,
  bulkDeleteProductsAction,
  importProductsCSVAction,
} from "@/server/actions/product";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  title: string;
  slug: string;
  brand: string;
  price: number;
  comparePrice?: number | null;
  currency: string;
  clicks: number;
  isPublished: boolean;
  isFeatured: boolean;
  affiliateNetwork: string;
  affiliateUrl: string;
  images: string[];
  tags: string[];
  categoryId?: any;
  category?: any;
  createdAt: string;
}

interface Props {
  initialProducts: Product[];
  categories: Category[];
}

export function AdminProductsTable({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isPending, startTransition] = useTransition();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState<"all" | "published" | "draft">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "standard">("all");
  const [sortBy, setSortBy] = useState<"newest" | "clicks" | "price-asc" | "price-desc" | "title">("newest");

  // Selection & Bulk
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialogs
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importCsvText, setImportCsvText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(q);
          const matchesBrand = p.brand.toLowerCase().includes(q);
          const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesBrand && !matchesTags) return false;
        }

        // Category filter
        if (selectedCategory !== "all") {
          const catSlug = p.category?.slug || p.categoryId?.slug || "";
          const catId = p.categoryId?._id || p.categoryId;
          if (catSlug !== selectedCategory && catId !== selectedCategory) return false;
        }

        // Published filter
        if (publishedFilter === "published" && !p.isPublished) return false;
        if (publishedFilter === "draft" && p.isPublished) return false;

        // Featured filter
        if (featuredFilter === "featured" && !p.isFeatured) return false;
        if (featuredFilter === "standard" && p.isFeatured) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "clicks") return (b.clicks || 0) - (a.clicks || 0);
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, searchQuery, selectedCategory, publishedFilter, featuredFilter, sortBy]);

  // Paginated chunk
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  // Select all / Deselect all
  const allCurrentSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((p) => selectedIds.includes(p._id));

  const toggleSelectAll = () => {
    if (allCurrentSelected) {
      const pageIds = new Set(paginatedProducts.map((p) => p._id));
      setSelectedIds(selectedIds.filter((id) => !pageIds.has(id)));
    } else {
      const newIds = Array.from(new Set([...selectedIds, ...paginatedProducts.map((p) => p._id)]));
      setSelectedIds(newIds);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Duplicate Action
  const handleDuplicate = (id: string, title: string) => {
    startTransition(async () => {
      const res = await duplicateProductAction(id);
      if (res.success) {
        toast.success(res.message);
        // Optimistic clone
        const original = products.find((p) => p._id === id);
        if (original && res.newId) {
          const cloned: Product = {
            ...original,
            _id: res.newId,
            title: `${original.title} (Copy)`,
            slug: `${original.slug}-copy`,
            clicks: 0,
            isPublished: false,
            createdAt: new Date().toISOString(),
          };
          setProducts([cloned, ...products]);
        }
      } else {
        toast.error(res.error || "Failed to duplicate product.");
      }
    });
  };

  // Single Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    const targetId = deleteTargetId;
    startTransition(async () => {
      const res = await deleteProductAction(targetId);
      if (res.success) {
        toast.success(res.message || "Product deleted.");
        setProducts((prev) => prev.filter((p) => p._id !== targetId));
        setSelectedIds((prev) => prev.filter((id) => id !== targetId));
      } else {
        toast.error(res.error || "Failed to delete product.");
      }
      setDeleteTargetId(null);
    });
  };

  // Bulk Status Update (Publish / Unpublish)
  const handleBulkStatus = (isPublished: boolean) => {
    if (selectedIds.length === 0) return;
    startTransition(async () => {
      const res = await bulkUpdateProductStatusAction(selectedIds, isPublished);
      if (res.success) {
        toast.success(res.message);
        setProducts((prev) =>
          prev.map((p) => (selectedIds.includes(p._id) ? { ...p, isPublished } : p))
        );
        setSelectedIds([]);
      } else {
        toast.error(res.error || "Failed to update selected products.");
      }
    });
  };

  // Bulk Delete
  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    const idsToDelete = [...selectedIds];
    startTransition(async () => {
      const res = await bulkDeleteProductsAction(idsToDelete);
      if (res.success) {
        toast.success(res.message);
        setProducts((prev) => prev.filter((p) => !idsToDelete.includes(p._id)));
        setSelectedIds([]);
      } else {
        toast.error(res.error || "Failed to delete selected products.");
      }
      setIsBulkDeleteOpen(false);
    });
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "title",
      "slug",
      "brand",
      "price",
      "comparePrice",
      "currency",
      "category",
      "affiliateNetwork",
      "affiliateUrl",
      "tags",
      "isPublished",
      "isFeatured",
      "clicks",
    ];

    const rows = filteredProducts.map((p) => [
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.slug}"`,
      `"${p.brand}"`,
      p.price,
      p.comparePrice || "",
      `"${p.currency || "USD"}"`,
      `"${p.category?.name || p.categoryId?.name || "General"}"`,
      `"${p.affiliateNetwork || "Amazon"}"`,
      `"${p.affiliateUrl}"`,
      `"${(p.tags || []).join(";")}"`,
      p.isPublished,
      p.isFeatured,
      p.clicks || 0,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `affiliate_products_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredProducts.length} products to CSV.`);
  };

  // CSV Import Parse & Execute
  const handleImportSubmit = async () => {
    if (!importCsvText.trim()) {
      toast.error("Please paste CSV data or choose a file.");
      return;
    }

    setIsImporting(true);
    try {
      const lines = importCsvText.trim().split("\n");
      if (lines.length < 2) {
        toast.error("CSV must contain a header row and at least one data row.");
        setIsImporting(false);
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
      const records: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple regex-based CSV splitter to handle quoted values
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",");
        const obj: any = {};
        headers.forEach((h, idx) => {
          let val = values[idx] || "";
          val = val.replace(/^["']|["']$/g, "").trim();
          obj[h] = val;
        });
        records.push(obj);
      }

      const res = await importProductsCSVAction(records);
      if (res.success) {
        toast.success(res.message);
        setIsImportModalOpen(false);
        setImportCsvText("");
        // Reload page to reflect updated DB records
        window.location.reload();
      } else {
        toast.error(res.error || "Failed to import CSV.");
      }
    } catch (err: any) {
      toast.error(`CSV Parsing error: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Product Catalog</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your affiliate inventory, price comparisons, and outbound tracking links ({filteredProducts.length} items).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export CSV</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span>Import CSV</span>
          </Button>

          <Link href="/admin/products/new">
            <Button variant="indigo" size="sm" className="flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input (5 cols) */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, brand, or tag..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Category Dropdown (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id || c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Published Status (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={publishedFilter}
              onChange={(e) => {
                setPublishedFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Sort By (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="clicks">Sort: Most Clicks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title">Title: A-Z</option>
            </select>
          </div>
        </div>

        {/* Featured Filter Chips */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] text-zinc-400 font-medium">Featured:</span>
          {(["all", "featured", "standard"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setFeaturedFilter(mode);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                featuredFilter === mode
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {mode === "all" ? "All" : mode === "featured" ? "Featured Only" : "Standard"}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Sticky Bar (when items selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-950/70 border border-indigo-500/30 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs text-indigo-200">
            <CheckSquare className="w-4 h-4 text-indigo-400" />
            <span>
              <strong>{selectedIds.length}</strong> product{selectedIds.length > 1 ? "s" : ""} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatus(true)}
              disabled={isPending}
              className="bg-indigo-900/40 hover:bg-indigo-900/60 border-indigo-500/40 text-indigo-200"
            >
              <Eye className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              <span>Publish</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatus(false)}
              disabled={isPending}
              className="bg-indigo-900/40 hover:bg-indigo-900/60 border-indigo-500/40 text-indigo-200"
            >
              <EyeOff className="w-3.5 h-3.5 mr-1 text-zinc-400" />
              <span>Unpublish</span>
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setIsBulkDeleteOpen(true)}
              disabled={isPending}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Delete Selected</span>
            </Button>
          </div>
        </div>
      )}

      {/* Products Data Table */}
      <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allCurrentSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all products on page"
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                <th className="p-4">Product</th>
                <th className="p-4">Brand / Network</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-center">Clicks</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                  const img =
                    p.images && p.images.length > 0
                      ? p.images[0]
                      : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80";

                  const isChecked = selectedIds.includes(p._id);

                  return (
                    <tr
                      key={p._id}
                      className={`hover:bg-zinc-800/30 transition-colors ${
                        isChecked ? "bg-indigo-950/20" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(p._id)}
                          aria-label={`Select ${p.title}`}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>

                      {/* Image & Title */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-zinc-950 overflow-hidden shrink-0 border border-zinc-800">
                            <Image
                              src={img}
                              alt={p.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-semibold text-white truncate text-xs">{p.title}</p>
                            <p className="text-[10px] text-zinc-400">
                              {p.category?.name || p.categoryId?.name || "General Collection"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Brand & Network */}
                      <td className="p-4">
                        <span className="font-medium text-white block">{p.brand}</span>
                        <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-indigo-500/20 font-semibold">
                          {p.affiliateNetwork}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4">
                        <span className="font-bold text-white block">
                          {formatPrice(p.price, p.currency)}
                        </span>
                        {p.comparePrice && (
                          <span className="text-[10px] text-zinc-400 line-through">
                            {formatPrice(p.comparePrice, p.currency)}
                          </span>
                        )}
                      </td>

                      {/* Clicks */}
                      <td className="p-4 text-center">
                        <span className="font-extrabold text-indigo-400 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                          {p.clicks || 0}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {p.isPublished ? (
                            <Badge variant="success">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                          {p.isFeatured && <Badge variant="featured">Featured</Badge>}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Outbound Test Link */}
                          <a
                            href={`/go/${p._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            title="Test Outbound Tracking Link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Duplicate Action */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(p._id, p.title)}
                            disabled={isPending}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-purple-300 hover:bg-purple-950/40 transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Edit Product */}
                          <Link
                            href={`/admin/products/${p._id}/edit`}
                            className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 transition-colors"
                            title="Edit Product Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          {/* Delete Action (opens Confirm Dialog) */}
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(p._id)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-xs text-zinc-500">
                    No products found matching your current search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length}{" "}
              products
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <span className="font-semibold text-white px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Single Product Confirm Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete Product Listing?"
        description="Are you sure you want to permanently delete this product? This action cannot be undone and will remove it from the public affiliate catalog."
        confirmLabel="Delete Product"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={isPending}
      />

      {/* Bulk Delete Confirm Dialog */}
      <ConfirmDialog
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        title={`Delete ${selectedIds.length} Products?`}
        description={`This will permanently remove the ${selectedIds.length} selected products from your catalog. This destructive action cannot be undone.`}
        confirmLabel={`Delete ${selectedIds.length} Products`}
        variant="destructive"
        onConfirm={handleBulkDeleteConfirm}
        isLoading={isPending}
      />

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => !isImporting && setIsImportModalOpen(false)}
          />

          <div className="relative w-full max-w-xl rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl z-10 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Import Products from CSV</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                disabled={isImporting}
                className="text-zinc-500 hover:text-zinc-300"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Paste standard CSV rows below with headers matching:
              <br />
              <code className="text-indigo-300 bg-zinc-900 px-1 py-0.5 rounded text-[11px] block mt-1">
                title,brand,price,comparePrice,currency,category,affiliateNetwork,affiliateUrl,tags,isPublished
              </code>
            </p>

            {/* File Upload Helper */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Upload CSV File:
              </label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setImportCsvText(event.target?.result as string);
                    };
                    reader.readAsText(file);
                  }
                }}
                className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
              />
            </div>

            {/* Paste CSV Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Or Paste CSV Text:</label>
              <textarea
                value={importCsvText}
                onChange={(e) => setImportCsvText(e.target.value)}
                rows={7}
                placeholder="title,brand,price,category,affiliateNetwork,affiliateUrl&#10;Silk Bomber Jacket,Everlane,140,Outerwear,Amazon,https://amazon.com/..."
                className="w-full p-3 font-mono text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsImportModalOpen(false)}
                disabled={isImporting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="indigo"
                size="sm"
                onClick={handleImportSubmit}
                disabled={isImporting}
              >
                {isImporting ? "Importing Products..." : "Import Products"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
