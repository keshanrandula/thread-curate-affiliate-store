import { ProductGridSkeleton, FilterSidebarSkeleton } from "@/components/SkeletonLoaders";

export default function SearchLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
      <div className="h-4 w-32 bg-zinc-800 rounded" />
      <div className="h-36 w-full rounded-3xl bg-zinc-900 border border-zinc-800 p-8 space-y-3">
        <div className="h-8 w-64 bg-zinc-800 rounded-xl" />
        <div className="h-10 w-96 bg-zinc-950 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="hidden lg:block w-64 shrink-0">
          <FilterSidebarSkeleton />
        </div>
        <div className="flex-1 w-full space-y-6">
          <div className="h-4 w-40 bg-zinc-800 rounded" />
          <ProductGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}
