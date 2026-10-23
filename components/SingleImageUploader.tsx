"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, Link as LinkIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import { getStorageProvider } from "@/lib/storage";

interface SingleImageUploaderProps {
  name: string;
  label?: string;
  initialValue?: string;
  placeholder?: string;
  onChange?: (url: string) => void;
  aspectRatio?: "square" | "video" | "banner";
}

export function SingleImageUploader({
  name,
  label,
  initialValue = "",
  placeholder = "Paste image URL or upload a file...",
  onChange,
  aspectRatio = "video",
}: SingleImageUploaderProps) {
  const [value, setValue] = useState(initialValue);
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const updateValue = (newUrl: string) => {
    setValue(newUrl);
    setError(null);
    onChange?.(newUrl);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const provider = getStorageProvider();
      const res = await provider.upload(file);
      updateValue(res.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be re-selected if needed
      e.target.value = "";
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
      setError("Please enter a valid URL starting with http://, https:// or /");
      return;
    }
    updateValue(trimmed);
    setUrlInput("");
    setShowUrlInput(false);
  };

  const handleRemove = () => {
    updateValue("");
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square max-w-[160px]"
      : aspectRatio === "banner"
      ? "aspect-[21/9] w-full"
      : "aspect-[16/9] max-w-sm w-full";

  return (
    <div className="space-y-2.5">
      {label && (
        <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300 block">
          {label}
        </label>
      )}

      {/* Hidden input to pass value in FormData */}
      <input type="hidden" name={name} value={value} />

      {value ? (
        /* Image Preview Box */
        <div className="relative group">
          <div
            className={`relative rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 shadow-sm ${aspectClass}`}
          >
            <Image
              src={value}
              alt={label || "Uploaded image"}
              fill
              sizes="(max-width: 640px) 100vw, 400px"
              className="object-cover"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
            <span className="text-[11px] text-stone-500 dark:text-zinc-400 truncate max-w-xs">
              {value}
            </span>
          </div>
        </div>
      ) : (
        /* Empty Upload & URL entry zone */
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* File Upload Button */}
            <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-95">
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image File</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            {/* Paste URL Toggle */}
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-800 text-stone-700 dark:text-zinc-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5 text-stone-500 dark:text-zinc-400" />
              <span>{showUrlInput ? "Cancel URL" : "Paste Image URL"}</span>
            </button>
          </div>

          {/* Paste URL Field */}
          {showUrlInput && (
            <div className="flex items-center gap-2 max-w-md pt-1 animate-in fade-in">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={placeholder}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="btn-amber-gradient px-3 py-1.5 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
