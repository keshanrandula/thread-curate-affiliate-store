import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getCategories, getProductById } from "@/lib/api";
import { ProductForm } from "@/components/ProductForm";
import { updateProductAction } from "@/server/actions/product";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const boundUpdateAction = updateProductAction.bind(null, id);

  return (
    <div className="py-2">
      <ProductForm
        title={`Edit Product: ${product.title}`}
        initialData={product}
        categories={categories}
        action={boundUpdateAction}
      />
    </div>
  );
}
