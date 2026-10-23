"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Plus, X, Link as LinkIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import { getStorageProvider } from "@/lib/storage";

export function ImageUploader({
  initialImages = [],
  onChange,
}: {
  initialImages?: string[];
  onChange?: (images: string[]) => void;
}) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addImageUrl = () => {
    if (!urlInput.trim()) return;
    const trimmed = urlInput.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
      setError("Please enter a valid URL starting with http://, https:// or /");
      return;
    }
    const updated = [...images, trimmed];
    setImages(updated);
    setUrlInput("");
    setError(null);
    onChange?.(updated);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onChange?.(updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const provider = getStorageProvider();
      const uploadPromises = Array.from(files).map((file) => provider.upload(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.url);
      const updated = [...images, ...newUrls];
      setImages(updated);
      onChange?.(updated);
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden textarea to submit with regular form actions */}
      <textarea
        name="images"
        value={images.join("\n")}
        readOnly
        className="hidden"
      />

      {/* Input options row */}
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
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 shadow-sm"
            />
          </div>
          <button
            type="button"
            onClick={addImageUrl}
            className="btn-amber-gradient px-4 py-2 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add URL
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
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

      {/* Thumbnails preview grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-xl bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 overflow-hidden shadow-sm"
            >
              <Image
                src={url}
                alt={`Uploaded image ${idx + 1}`}
                fill
                sizes="150px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold shadow-md">
                  Cover Photo
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-stone-300 dark:border-zinc-800 rounded-xl p-6 text-center text-xs text-stone-500 dark:text-zinc-500 flex flex-col items-center justify-center gap-2">
          <ImageIcon className="w-8 h-8 text-stone-400 dark:text-zinc-600" />
          <span>No images added yet. Add an image URL or upload photos above.</span>
        </div>
      )}
    </div>
  );
}
