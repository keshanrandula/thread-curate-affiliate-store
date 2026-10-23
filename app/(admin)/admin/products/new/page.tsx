import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getCategories } from "@/lib/api";
import { ProductForm } from "@/components/ProductForm";
import { createProductAction } from "@/server/actions/product";

export default async function NewProductPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const categories = await getCategories();

  return (
    <div className="py-2">
      <ProductForm
        title="Add New Affiliate Product"
        categories={categories}
        action={createProductAction}
      />
    </div>
  );
}
