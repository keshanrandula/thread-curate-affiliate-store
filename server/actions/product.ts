"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, Category } from "@/models";
import { ProductInputSchema } from "@/lib/validations";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function createProductAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Unauthorized. Admin session required." };
  }

  const rawTitle = (formData.get("title") as string) || "";
  const rawSlug = (formData.get("slug") as string) || slugify(rawTitle);
  const rawDescription = (formData.get("description") as string) || "";
  const rawImages = (formData.get("images") as string) || "";
  const rawPrice = formData.get("price");
  const rawComparePrice = formData.get("comparePrice");
  const rawCurrency = (formData.get("currency") as string) || "USD";
  const rawBrand = (formData.get("brand") as string) || "";
  const rawRating = formData.get("rating") || 4.5;
  const rawAffiliateUrl = (formData.get("affiliateUrl") as string) || "";
  const rawAffiliateNetwork = (formData.get("affiliateNetwork") as string) || "";
  const rawCategoryId = (formData.get("categoryId") as string) || "";
  const rawTags = (formData.get("tags") as string) || "";
  const rawAttributes = (formData.get("attributes") as string) || "{}";
  const isFeatured = formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true";
  const isPublished = formData.get("isPublished") === "on" || formData.get("isPublished") === "true";

  // Parse images array
  const images = rawImages
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Parse tags array
  const tags = rawTags
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Parse attributes JSON
  let attributes = {};
  try {
    attributes = JSON.parse(rawAttributes);
  } catch {
    attributes = {};
  }

  const parseResult = ProductInputSchema.safeParse({
    title: rawTitle,
    slug: rawSlug,
    description: rawDescription,
    images:
      images.length > 0
        ? images
        : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"],
    price: rawPrice,
    comparePrice: rawComparePrice ? rawComparePrice : null,
    currency: rawCurrency,
    brand: rawBrand,
    rating: rawRating,
    affiliateUrl: rawAffiliateUrl,
    affiliateNetwork: rawAffiliateNetwork,
    categoryId: rawCategoryId,
    tags,
    attributes,
    isFeatured,
    isPublished,
  });

  if (!parseResult.success) {
    const issues = (parseResult.error as any).issues || (parseResult.error as any).errors || [];
    return {
      error:
        issues.map((e: any) => `${e.path?.join(".") || "field"}: ${e.message}`).join(", ") ||
        parseResult.error.message,
    };
  }

  try {
    await connectToDatabase();

    // Check if slug is unique
    const existing = await Product.findOne({ slug: parseResult.data.slug });
    if (existing) {
      return { error: `A product with slug "${parseResult.data.slug}" already exists.` };
    }

    await Product.create(parseResult.data);
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { error: error.message || "Failed to create product in database." };
  }

  revalidateTag("products", { expire: 0 });
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProductAction(id: string, formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  const rawTitle = (formData.get("title") as string) || "";
  const rawSlug = (formData.get("slug") as string) || slugify(rawTitle);
  const rawDescription = (formData.get("description") as string) || "";
  const rawImages = (formData.get("images") as string) || "";
  const rawPrice = formData.get("price");
  const rawComparePrice = formData.get("comparePrice");
  const rawCurrency = (formData.get("currency") as string) || "USD";
  const rawBrand = (formData.get("brand") as string) || "";
  const rawRating = formData.get("rating") || 4.5;
  const rawAffiliateUrl = (formData.get("affiliateUrl") as string) || "";
  const rawAffiliateNetwork = (formData.get("affiliateNetwork") as string) || "";
  const rawCategoryId = (formData.get("categoryId") as string) || "";
  const rawTags = (formData.get("tags") as string) || "";
  const rawAttributes = (formData.get("attributes") as string) || "{}";
  const isFeatured = formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true";
  const isPublished = formData.get("isPublished") === "on" || formData.get("isPublished") === "true";

  const images = rawImages
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const tags = rawTags
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  let attributes = {};
  try {
    attributes = JSON.parse(rawAttributes);
  } catch {
    attributes = {};
  }

  const parseResult = ProductInputSchema.safeParse({
    title: rawTitle,
    slug: rawSlug,
    description: rawDescription,
    images:
      images.length > 0
        ? images
        : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"],
    price: rawPrice,
    comparePrice: rawComparePrice ? rawComparePrice : null,
    currency: rawCurrency,
    brand: rawBrand,
    rating: rawRating,
    affiliateUrl: rawAffiliateUrl,
    affiliateNetwork: rawAffiliateNetwork,
    categoryId: rawCategoryId,
    tags,
    attributes,
    isFeatured,
    isPublished,
  });

  if (!parseResult.success) {
    const issues = (parseResult.error as any).issues || (parseResult.error as any).errors || [];
    return {
      error:
        issues.map((e: any) => `${e.path?.join(".") || "field"}: ${e.message}`).join(", ") ||
        parseResult.error.message,
    };
  }

  try {
    await connectToDatabase();
    await Product.findByIdAndUpdate(id, parseResult.data);
  } catch (error: any) {
    return { error: error.message || "Failed to update product." };
  }

  revalidateTag("products", { expire: 0 });
  revalidatePath("/shop");
  revalidatePath(`/product/${parseResult.data.slug}`);
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProductAction(id: string) {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await connectToDatabase();
    await Product.findByIdAndDelete(id);
    revalidateTag("products", { expire: 0 });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true, message: "Product deleted successfully." };
  } catch (error: any) {
    return { error: error.message || "Failed to delete product." };
  }
}

export async function duplicateProductAction(id: string) {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await connectToDatabase();
    const original = await Product.findById(id).lean();
    if (!original) {
      return { error: "Product not found to duplicate." };
    }

    const origObj = original as any;
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const newTitle = `${origObj.title} (Copy)`;
    const newSlug = `${origObj.slug}-copy-${randomSuffix}`;

    const newProd = await Product.create({
      ...origObj,
      _id: undefined,
      title: newTitle,
      slug: newSlug,
      clicks: 0,
      isPublished: false,
    });

    revalidateTag("products", { expire: 0 });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    return {
      success: true,
      message: `Duplicated as "${newTitle}" (Draft).`,
      newId: newProd._id.toString(),
    };
  } catch (error: any) {
    return { error: error.message || "Failed to duplicate product." };
  }
}

export async function bulkUpdateProductStatusAction(ids: string[], isPublished: boolean) {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  if (!ids || ids.length === 0) {
    return { error: "No products selected." };
  }

  try {
    await connectToDatabase();
    await Product.updateMany(
      { _id: { $in: ids } },
      { $set: { isPublished } }
    );

    revalidateTag("products", { expire: 0 });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    return {
      success: true,
      count: ids.length,
      message: `${ids.length} product(s) marked as ${isPublished ? "Published" : "Draft"}.`,
    };
  } catch (error: any) {
    return { error: error.message || "Failed to perform bulk update." };
  }
}

export async function bulkDeleteProductsAction(ids: string[]) {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  if (!ids || ids.length === 0) {
    return { error: "No products selected." };
  }

  try {
    await connectToDatabase();
    await Product.deleteMany({ _id: { $in: ids } });

    revalidateTag("products", { expire: 0 });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    return {
      success: true,
      count: ids.length,
      message: `Successfully deleted ${ids.length} product(s).`,
    };
  } catch (error: any) {
    return { error: error.message || "Failed to perform bulk delete." };
  }
}

export async function importProductsCSVAction(records: any[]) {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  if (!records || !Array.isArray(records) || records.length === 0) {
    return { error: "No valid product records found in CSV." };
  }

  try {
    await connectToDatabase();
    // Fetch categories to match slug or name to ID
    const categories = await Category.find({}).lean();
    const catMap = new Map<string, string>();
    categories.forEach((c: any) => {
      catMap.set(c.slug.toLowerCase(), c._id.toString());
      catMap.set(c.name.toLowerCase(), c._id.toString());
    });
    const defaultCatId = categories[0]?._id?.toString() || "";

    let importedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      if (!row.title || !row.price) {
        continue;
      }

      const rawTitle = String(row.title).trim();
      const rawSlug = row.slug ? slugify(String(row.slug)) : `${slugify(rawTitle)}-${Math.random().toString(36).substring(2, 6)}`;
      
      let matchedCatId = defaultCatId;
      if (row.category) {
        const catKey = String(row.category).trim().toLowerCase();
        if (catMap.has(catKey)) {
          matchedCatId = catMap.get(catKey)!;
        }
      }

      const images = row.images
        ? String(row.images).split("|").map((s) => s.trim()).filter(Boolean)
        : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"];

      const tags = row.tags
        ? String(row.tags).split(";").map((s) => s.trim()).filter(Boolean)
        : [];

      const parsed = ProductInputSchema.safeParse({
        title: rawTitle,
        slug: rawSlug,
        description: row.description || "",
        images,
        price: Number(row.price),
        comparePrice: row.comparePrice ? Number(row.comparePrice) : null,
        currency: row.currency || "USD",
        brand: row.brand || "Unbranded",
        rating: row.rating ? Number(row.rating) : 4.5,
        affiliateUrl: row.affiliateUrl || "https://amazon.com",
        affiliateNetwork: row.affiliateNetwork || "Amazon",
        categoryId: matchedCatId,
        tags,
        attributes: {},
        isFeatured: row.isFeatured === "true" || row.isFeatured === true,
        isPublished: row.isPublished !== "false" && row.isPublished !== false,
      });

      if (parsed.success) {
        await Product.create(parsed.data);
        importedCount++;
      } else {
        errors.push(`Row ${i + 1} (${rawTitle}): ${parsed.error.message}`);
      }
    }

    revalidateTag("products", { expire: 0 });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    return {
      success: true,
      imported: importedCount,
      errors: errors.slice(0, 5),
      message: `Imported ${importedCount} products successfully!`,
    };
  } catch (error: any) {
    return { error: error.message || "Failed to import CSV." };
  }
}
