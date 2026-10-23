"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function AttributeChips({
  attributes,
}: {
  attributes?: Record<string, any>;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  if (!attributes || Object.keys(attributes).length === 0) return null;

  const rawSizes = attributes.Sizes || attributes.Ages;
  const sizes: string[] = Array.isArray(rawSizes)
    ? rawSizes
    : attributes.Size
    ? [attributes.Size]
    : [];

  const rawColor = attributes.Color || attributes.Colors;
  const colors: string[] = Array.isArray(rawColor)
    ? rawColor
    : rawColor
    ? [rawColor]
    : [];

  return (
    <div className="space-y-4 pt-2">
      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-stone-900 dark:text-white text-[11px]">
              Available Sizes
            </span>
            {selectedSize && (
              <span className="text-stone-500 dark:text-zinc-400">
                Selected: <strong className="text-stone-900 dark:text-white">{selectedSize}</strong>
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md shadow-orange-500/30 scale-105"
                      : "bg-stone-100 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 border-stone-200 dark:border-zinc-800 hover:border-amber-400 dark:hover:border-zinc-700 hover:text-stone-900 dark:hover:text-white"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-stone-900 dark:text-white text-[11px]">
              Color Variant
            </span>
            {selectedColor && (
              <span className="text-stone-500 dark:text-zinc-400">
                Selected: <strong className="text-stone-900 dark:text-white">{selectedColor}</strong>
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md shadow-orange-500/30 scale-105"
                      : "bg-stone-100 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 border-stone-200 dark:border-zinc-800 hover:border-amber-400 dark:hover:border-zinc-700 hover:text-stone-900 dark:hover:text-white"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
