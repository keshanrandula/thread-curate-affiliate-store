"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ZoomIn, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

export function ProductGallery({
  images,
  title,
  discount,
}: {
  images: string[];
  title: string;
  discount?: number | null;
}) {
  const validImages = images && images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
  ];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Active Image Viewport with Coordinate Zoom */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        className="group relative aspect-[3/4] sm:aspect-square w-full rounded-2xl bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800/80 overflow-hidden shadow-md dark:shadow-2xl cursor-crosshair select-none transition-colors"
      >
        <Image
          src={validImages[activeImageIndex]}
          alt={`${title} - view ${activeImageIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          style={{
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
          }}
          className={`object-cover object-center transition-transform duration-200 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
        />

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="badge-discount text-xs font-extrabold px-3 py-1 rounded-lg shadow-lg uppercase tracking-wider">
              -{discount}% OFF
            </span>
          </div>
        )}

        {/* Zoom Cue & Lightbox Trigger */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="p-2 rounded-xl bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200 dark:bg-zinc-950/80 dark:hover:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white dark:border-zinc-800 shadow-md backdrop-blur-md transition-all active:scale-90"
            title="Open Fullscreen Lightbox"
            aria-label="Expand photo"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Hover zoom instruction pill */}
        <div className="absolute bottom-4 right-4 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md text-stone-700 dark:text-zinc-300 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-stone-200 dark:border-zinc-800 flex items-center gap-1 shadow-md">
            <ZoomIn className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Hover to zoom</span>
          </span>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-20 h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                activeImageIndex === idx
                  ? "border-amber-500 ring-2 ring-amber-500/30 scale-105"
                  : "border-stone-200 dark:border-zinc-800 opacity-60 hover:opacity-100"
              }`}
              aria-label={`View photo ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors z-50"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center">
            <Image
              src={validImages[activeImageIndex]}
              alt={`${title} fullscreen`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {/* Navigation controls in lightbox */}
          {validImages.length > 1 && (
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
              <button
                onClick={() =>
                  setActiveImageIndex(
                    (prev) => (prev - 1 + validImages.length) % validImages.length
                  )
                }
                className="pointer-events-auto p-3 rounded-full bg-zinc-900/90 border border-zinc-800 text-white hover:bg-zinc-800 transition-all shadow-xl"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev + 1) % validImages.length)
                }
                className="pointer-events-auto p-3 rounded-full bg-zinc-900/90 border border-zinc-800 text-white hover:bg-zinc-800 transition-all shadow-xl"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
