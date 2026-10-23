import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getProducts, getCategories } from "@/lib/api";
import { AdminProductsTable } from "@/components/AdminProductsTable";

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({
      limit: 500, // Load catalog for fast client-side sorting, filtering, and bulk operations
    }),
  ]);

  return (
    <AdminProductsTable
      initialProducts={result.products as any}
      categories={categories.map((c) => ({
        _id: c._id,
        name: c.name,
        slug: c.slug,
      }))}
    />
  );
}
