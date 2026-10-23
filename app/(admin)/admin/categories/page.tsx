import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getCategories } from "@/lib/api";
import { AdminCategoriesManager } from "@/components/AdminCategoriesManager";

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const categories = await getCategories();

  return (
    <AdminCategoriesManager
      initialCategories={categories.map((c) => ({
        _id: c._id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        parentId: c.parentId,
        sortOrder: c.sortOrder,
      }))}
    />
  );
}
