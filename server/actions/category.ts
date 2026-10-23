"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { Category, Product } from "@/models";
import { CategoryInputSchema } from "@/lib/validations";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function createCategoryAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  const name = (formData.get("name") as string) || "";
  const slug = (formData.get("slug") as string) || slugify(name);
  const description = (formData.get("description") as string) || "";
  const image = (formData.get("image") as string) || "";
  const parentId = (formData.get("parentId") as string) || null;
  const sortOrder = formData.get("sortOrder") || 0;

  const result = CategoryInputSchema.safeParse({
    name,
    slug,
    description,
    image,
    parentId: !parentId || parentId === "" ? null : parentId,
    sortOrder,
  });

  if (!result.success) {
    const issues = (result.error as any).issues || (result.error as any).errors || [];
    return {
      error: issues.map((e: any) => e.message).join(", ") || result.error.message,
    };
  }

  try {
    await connectToDatabase();
    const existing = await Category.findOne({ slug: result.data.slug });
    if (existing) {
      return { error: `Category slug "${result.data.slug}" already exists.` };
    }

    const created = await Category.create(result.data);
    revalidateTag("categories", { expire: 0 });
    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/");
    return {
      success: true,
      message: `Category "${name}" created successfully!`,
      category: { ...created.toObject(), _id: created._id.toString() },
    };
  } catch (error: any) {
    return { error: error.message || "Failed to create category." };
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  const name = (formData.get("name") as string) || "";
  const slug = (formData.get("slug") as string) || slugify(name);
  const description = (formData.get("description") as string) || "";
  const image = (formData.get("image") as string) || "";
  const parentId = (formData.get("parentId") as string) || null;
  const sortOrder = formData.get("sortOrder") || 0;

  const result = CategoryInputSchema.safeParse({
    name,
    slug,
    description,
    image,
    parentId: !parentId || parentId === "" ? null : parentId,
    sortOrder,
  });

  if (!result.success) {
    const issues = (result.error as any).issues || (result.error as any).errors || [];
    return {
      error: issues.map((e: any) => e.message).join(", ") || result.error.message,
    };
  }

  try {
    await connectToDatabase();
    await Category.findByIdAndUpdate(id, result.data);
    revalidateTag("categories", { expire: 0 });
    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true, message: `Category "${name}" updated successfully!` };
  } catch (error: any) {
    return { error: error.message || "Failed to update category." };
  }
}

export async function deleteCategoryAction(id: string) {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  try {
    await connectToDatabase();
    // Re-assign child categories if any
    await Category.updateMany({ parentId: id }, { $set: { parentId: null } });
    await Category.findByIdAndDelete(id);

    revalidateTag("categories", { expire: 0 });
    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true, message: "Category deleted successfully." };
  } catch (error: any) {
    return { error: error.message || "Failed to delete category." };
  }
}

export async function reorderCategoriesAction(
  reorderedItems: { id: string; sortOrder: number }[]
) {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  try {
    await connectToDatabase();
    const ops = reorderedItems.map((item) =>
      Category.findByIdAndUpdate(item.id, { $set: { sortOrder: item.sortOrder } })
    );
    await Promise.all(ops);

    revalidateTag("categories", { expire: 0 });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true, message: "Category sort order saved!" };
  } catch (error: any) {
    return { error: error.message || "Failed to update category sort order." };
  }
}
