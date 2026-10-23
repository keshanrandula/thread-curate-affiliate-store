"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  FolderTree,
} from "lucide-react";
import { toast } from "sonner";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  reorderCategoriesAction,
} from "@/server/actions/category";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/utils";
import { SingleImageUploader } from "@/components/SingleImageUploader";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: any;
  sortOrder: number;
}

interface Props {
  initialCategories: Category[];
}

export function AdminCategoriesManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isPending, startTransition] = useTransition();

  // Create form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [parentId, setParentId] = useState("");
  const [isSlugLocked, setIsSlugLocked] = useState(false);

  // Edit modal state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Delete confirm dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Drag-and-drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugLocked) {
      setSlug(slugify(val));
    }
  };

  // Add Category Submit
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug || slugify(name));
    formData.set("description", description);
    formData.set("image", image);
    formData.set("parentId", parentId);
    formData.set("sortOrder", String(categories.length + 1));

    startTransition(async () => {
      const res = await createCategoryAction(formData);
      if (res.success && res.category) {
        toast.success(res.message);
        setCategories([...categories, res.category as any]);
        // Reset form
        setName("");
        setSlug("");
        setDescription("");
        setImage("");
        setParentId("");
      } else {
        toast.error(res.error || "Failed to create category.");
      }
    });
  };

  // Update Category Submit
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const formData = new FormData();
    formData.set("name", editingCategory.name);
    formData.set("slug", editingCategory.slug);
    formData.set("description", editingCategory.description || "");
    formData.set("image", editingCategory.image || "");
    formData.set("parentId", editingCategory.parentId || "");
    formData.set("sortOrder", String(editingCategory.sortOrder || 0));

    startTransition(async () => {
      const res = await updateCategoryAction(editingCategory._id, formData);
      if (res.success) {
        toast.success(res.message);
        setCategories((prev) =>
          prev.map((c) => (c._id === editingCategory._id ? editingCategory : c))
        );
        setEditingCategory(null);
      } else {
        toast.error(res.error || "Failed to update category.");
      }
    });
  };

  // Delete Category Submit
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    const targetId = deleteTargetId;
    startTransition(async () => {
      const res = await deleteCategoryAction(targetId);
      if (res.success) {
        toast.success(res.message);
        setCategories((prev) => prev.filter((c) => c._id !== targetId));
      } else {
        toast.error(res.error || "Failed to delete category.");
      }
      setDeleteTargetId(null);
    });
  };

  // Reordering DnD
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const reordered = [...categories];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    const updated = reordered.map((cat, idx) => ({
      ...cat,
      sortOrder: idx + 1,
    }));

    setCategories(updated);
    setDraggedIndex(null);

    startTransition(async () => {
      const res = await reorderCategoriesAction(
        updated.map((c) => ({ id: c._id, sortOrder: c.sortOrder }))
      );
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error || "Failed to save order.");
      }
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
          <FolderTree className="w-6 h-6 text-amber-500" />
          <span>Category Hierarchy &amp; Navigation</span>
        </h1>
        <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
          Organize your affiliate collections into parent and sub-categories with live image uploads and drag-and-drop sort order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Add New Category Form (5 cols) */}
        <div className="lg:col-span-5 bg-white/80 dark:bg-zinc-900/60 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800/80 space-y-4 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex items-center gap-2 border-b border-stone-200 dark:border-zinc-800 pb-3">
            <Plus className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Add New Category
            </h2>
          </div>

          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Category Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="e.g. Footwear, Outerwear, Activewear"
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugLocked(true);
                }}
                placeholder="auto-generated-slug"
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-700 dark:text-zinc-300 placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Parent Category</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-zinc-900">None (Top-Level Category)</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id} className="bg-white dark:bg-zinc-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Image File Upload & Preview */}
            <SingleImageUploader
              name="image"
              label="Category Banner / Photo"
              initialValue={image}
              onChange={(url) => setImage(url)}
              aspectRatio="video"
              placeholder="Upload category photo or enter image URL..."
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary for category headers and SEO..."
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-amber-gradient w-full py-2.5 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isPending ? "Creating..." : "Create Category"}</span>
            </button>
          </form>
        </div>

        {/* Right: Tree View & Drag-and-Drop Sort Order (7 cols) */}
        <div className="lg:col-span-7 bg-white/80 dark:bg-zinc-900/60 rounded-2xl border border-stone-200 dark:border-zinc-800/80 p-6 space-y-4 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
            <div>
              <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span>Categories Tree View ({categories.length})</span>
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                Drag using the grip handle to reorder live catalog priorities.
              </p>
            </div>
            <Badge variant="default" className="text-[10px]">
              Drag to Sort
            </Badge>
          </div>

          <div className="space-y-2">
            {categories.map((cat, idx) => {
              const isChild = Boolean(cat.parentId);
              const parent = categories.find((c) => c._id === cat.parentId);

              return (
                <div
                  key={cat._id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(idx)}
                  className={`group p-3 rounded-xl bg-white dark:bg-zinc-950 border transition-all flex items-center justify-between gap-3 shadow-sm ${
                    draggedIndex === idx
                      ? "opacity-40 border-amber-500 scale-98"
                      : "border-stone-200 dark:border-zinc-800/80 hover:border-amber-500/50 hover:bg-stone-50 dark:hover:bg-zinc-900/40"
                  } ${isChild ? "ml-6 border-l-2 border-l-amber-500" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Drag Grip Handle */}
                    <div className="cursor-grab active:cursor-grabbing text-stone-400 dark:text-zinc-500 hover:text-stone-700 dark:hover:text-zinc-300 p-1">
                      <GripVertical className="w-4 h-4" />
                    </div>

                    {/* Image / Icon */}
                    <div className="relative w-10 h-10 rounded-lg bg-stone-100 dark:bg-zinc-900 overflow-hidden shrink-0 border border-stone-200 dark:border-zinc-800 flex items-center justify-center">
                      {cat.image ? (
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <Layers className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
                      )}
                    </div>

                    {/* Name & Slug */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xs text-stone-900 dark:text-white truncate">{cat.name}</h3>
                        {isChild && (
                          <span className="text-[9px] text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded font-medium">
                            Sub of {parent?.name || "Parent"}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-500 dark:text-zinc-400">
                        slug: <code className="text-amber-600 dark:text-amber-400">{cat.slug}</code> &bull; order:{" "}
                        {cat.sortOrder}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(cat)}
                      className="p-1.5 rounded-lg text-stone-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(cat._id)}
                      className="p-1.5 rounded-lg text-stone-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm"
            onClick={() => setEditingCategory(null)}
          />

          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 p-6 shadow-2xl z-10 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">Edit Category: {editingCategory.name}</h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-300 p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Slug</label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, slug: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Parent Category</label>
                <select
                  value={editingCategory.parentId || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      parentId: e.target.value === "" ? null : e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="" className="bg-white dark:bg-zinc-900">None (Top-Level Category)</option>
                  {categories
                    .filter((c) => c._id !== editingCategory._id)
                    .map((c) => (
                      <option key={c._id} value={c._id} className="bg-white dark:bg-zinc-900">
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Edit Image with Upload */}
              <SingleImageUploader
                name="edit-category-image"
                label="Category Banner / Photo"
                initialValue={editingCategory.image || ""}
                onChange={(url) =>
                  setEditingCategory({ ...editingCategory, image: url })
                }
                aspectRatio="video"
              />

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Description</label>
                <textarea
                  value={editingCategory.description || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-amber-gradient px-4 py-2 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {isPending ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete Category"
        description="Are you sure you want to delete this category? Products inside this category will remain, but will no longer be linked to it."
        confirmLabel="Delete Category"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
