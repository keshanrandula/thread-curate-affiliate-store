import { ProductCard } from "./ProductCard";
import { EmptyState } from "./EmptyState";

export interface ProductGridProps {
  products: any[];
  columns?: 3 | 4;
  emptyTitle?: string;
  emptyMessage?: string;
  resetHref?: string;
}

export function ProductGrid({
  products,
  columns = 4,
  emptyTitle,
  emptyMessage,
  resetHref,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || "No products found"}
        description={
          emptyMessage ||
          "We couldn't find any products matching your selected filters. Try broadening your criteria or clearing filters."
        }
        resetHref={resetHref}
      />
    );
  }

  const gridColsClass =
    columns === 3
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={`grid ${gridColsClass} gap-4 sm:gap-6`}>
      {products.map((product, idx) => (
        <ProductCard
          key={product._id}
          product={product}
          priority={idx < 4}
        />
      ))}
    </div>
  );
}
