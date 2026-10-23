import { ProductGridSkeleton } from "@/components/SkeletonLoaders";

export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-12">
      {/* Hero skeleton */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="h-6 w-48 bg-zinc-800 rounded-full mx-auto" />
        <div className="h-12 w-3/4 bg-zinc-800 rounded-2xl mx-auto" />
        <div className="h-4 w-1/2 bg-zinc-800/60 rounded mx-auto" />
      </div>

      {/* Grid skeleton */}
      <ProductGridSkeleton count={8} />
    </div>
  );
}
