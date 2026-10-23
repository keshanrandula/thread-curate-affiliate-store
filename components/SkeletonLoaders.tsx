export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-zinc-900/40 rounded-2xl border border-zinc-800/60 overflow-hidden animate-pulse">
      {/* Image box skeleton */}
      <div className="aspect-[3/4] w-full bg-zinc-800/60" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-zinc-800 rounded" />
          <div className="h-3 w-8 bg-zinc-800 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-zinc-800 rounded" />
        <div className="h-3 w-1/2 bg-zinc-800/50 rounded" />
        <div className="pt-3 flex justify-between items-center border-t border-zinc-800/60">
          <div className="h-5 w-16 bg-zinc-800 rounded" />
          <div className="h-7 w-20 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-4 w-48 bg-zinc-800 rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 aspect-square bg-zinc-900 rounded-2xl border border-zinc-800" />
        <div className="lg:col-span-5 space-y-6">
          <div className="h-4 w-24 bg-zinc-800 rounded" />
          <div className="h-8 w-3/4 bg-zinc-800 rounded" />
          <div className="h-20 bg-zinc-900 rounded-2xl border border-zinc-800" />
          <div className="h-12 bg-zinc-800 rounded-2xl" />
          <div className="space-y-2 pt-4">
            <div className="h-3 w-full bg-zinc-800/60 rounded" />
            <div className="h-3 w-5/6 bg-zinc-800/60 rounded" />
            <div className="h-3 w-2/3 bg-zinc-800/60 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FilterSidebarSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-28 bg-zinc-800 rounded" />
      <div className="space-y-3">
        <div className="h-4 w-20 bg-zinc-800 rounded" />
        <div className="h-10 bg-zinc-900 rounded-xl border border-zinc-800" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-20 bg-zinc-800 rounded" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-32 bg-zinc-800/50 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
