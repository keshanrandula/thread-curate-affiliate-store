"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Upload,
  Plus,
  X,
  Link as LinkIcon,
  Image as ImageIcon,
  GripVertical,
  Loader2,
} from "lucide-react";
import { getStorageProvider } from "@/lib/storage";

interface Props {
  initialImages?: string[];
  onChange?: (images: string[]) => void;
}

export function ImageUploaderWithDnd({ initialImages = [], onChange }: Props) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragOverDropzone, setIsDragOverDropzone] = useState(false);

  const notifyChange = (newImages: string[]) => {
    setImages(newImages);
    onChange?.(newImages);
  };

  const addImageUrl = () => {
    if (!urlInput.trim()) return;
    const trimmed = urlInput.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
      setError("Please enter a valid URL starting with http://, https:// or /");
      return;
    }
    const updated = [...images, trimmed];
    notifyChange(updated);
    setUrlInput("");
    setError(null);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    notifyChange(updated);
  };

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const provider = getStorageProvider();
      const uploadPromises = Array.from(files).map((file) => provider.upload(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.url);
      const updated = [...images, ...newUrls];
      notifyChange(updated);
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await uploadFiles(e.target.files);
      e.target.value = "";
    }
  };

  // Drag and drop handlers for reordering images
  const handleItemDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleItemDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleItemDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const reordered = [...images];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    setDraggedIndex(null);
    notifyChange(reordered);
  };

  // Dropzone drag-and-drop file upload handlers
  const handleDropzoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverDropzone(true);
  };

  const handleDropzoneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverDropzone(false);
  };

  const handleDropzoneDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverDropzone(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden textarea to submit images with regular form actions */}
      <textarea
        name="images"
        value={images.join("\n")}
        readOnly
        className="hidden"
      />

      {/* Input options row: File Upload & URL Input */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Direct URL input */}
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-stone-400 dark:text-zinc-500" />
            <input
              type="url"
              placeholder="Paste image URL (e.g. Unsplash, Amazon, ASOS)..."
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImageUrl();
                }
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 shadow-sm transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={addImageUrl}
            className="btn-amber-gradient px-4 py-2 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Image
          </button>
        </div>

        {/* File upload button */}
        <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-md shadow-orange-500/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95">
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photos</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

      {/* Drag & Drop Upload Zone (Interactive when dragging files from PC) */}
      <div
        onDragOver={handleDropzoneDragOver}
        onDragLeave={handleDropzoneDragLeave}
        onDrop={handleDropzoneDrop}
        className={`border-2 border-dashed rounded-2xl p-6 text-center text-xs transition-colors flex flex-col items-center justify-center gap-2 ${
          isDragOverDropzone
            ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            : "border-stone-200 dark:border-zinc-800/80 bg-stone-50/50 dark:bg-zinc-950/40 text-stone-500 dark:text-zinc-400 hover:border-amber-400/50"
        }`}
      >
        <ImageIcon className={`w-8 h-8 ${isDragOverDropzone ? "text-amber-500 scale-110" : "text-stone-400 dark:text-zinc-600"} transition-transform`} />
        <div>
          <span className="font-semibold text-stone-700 dark:text-zinc-300">
            Drag and drop images here
          </span>
          <span className="block text-[11px] text-stone-400 dark:text-zinc-500 mt-0.5">
            Supports JPEG, PNG, WebP, GIF, SVG (up to 10MB per image)
          </span>
        </div>
      </div>

      {/* Reorder instructions */}
      {images.length > 1 && (
        <p className="text-[11px] text-stone-500 dark:text-zinc-400 flex items-center gap-1.5 pt-1">
          <GripVertical className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Drag thumbnails horizontally to reorder. The first photo will be used as the primary hero image.</span>
        </p>
      )}

      {/* Thumbnails preview grid with drag-and-drop reordering */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              draggable
              onDragStart={() => handleItemDragStart(idx)}
              onDragOver={handleItemDragOver}
              onDrop={() => handleItemDrop(idx)}
              className={`group relative aspect-square rounded-xl bg-stone-100 dark:bg-zinc-950 border overflow-hidden cursor-grab active:cursor-grabbing transition-all shadow-sm ${
                draggedIndex === idx
                  ? "opacity-50 border-amber-500 scale-95"
                  : "border-stone-200 dark:border-zinc-800 hover:border-amber-500/50 hover:shadow-md"
              }`}
            >
              <Image
                src={url}
                alt={`Product image ${idx + 1}`}
                fill
                sizes="150px"
                className="object-cover pointer-events-none"
              />

              {/* Drag Handle Overlay */}
              <div className="absolute top-1.5 left-1.5 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <GripVertical className="w-3.5 h-3.5" />
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Primary Image Badge */}
              {idx === 0 && (
                <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold shadow-md">
                  Cover Photo
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
