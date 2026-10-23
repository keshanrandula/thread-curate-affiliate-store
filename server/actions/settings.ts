"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { SiteSettings } from "@/models";
import { SiteSettingsInputSchema } from "@/lib/validations";
import { getAdminSession } from "@/lib/auth";

export async function updateSettingsAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  const siteName = (formData.get("siteName") as string) || "";
  const logo = (formData.get("logo") as string) || "";
  const heroTitle = (formData.get("heroTitle") as string) || "";
  const heroSubtitle = (formData.get("heroSubtitle") as string) || "";
  const disclosureText = (formData.get("disclosureText") as string) || "";
  
  // Social links
  const twitter = (formData.get("twitter") as string) || "";
  const instagram = (formData.get("instagram") as string) || "";
  const facebook = (formData.get("facebook") as string) || "";
  const pinterest = (formData.get("pinterest") as string) || "";
  const youtube = (formData.get("youtube") as string) || "";

  // SEO defaults
  const metaTitle = (formData.get("metaTitle") as string) || "";
  const metaDescription = (formData.get("metaDescription") as string) || "";
  const ogImage = (formData.get("ogImage") as string) || "";
  const keywords = (formData.get("keywords") as string) || "";

  const result = SiteSettingsInputSchema.safeParse({
    siteName,
    logo,
    heroTitle,
    heroSubtitle,
    disclosureText,
    socialLinks: {
      twitter,
      instagram,
      facebook,
      pinterest,
      youtube,
    },
    seoDefaults: {
      metaTitle,
      metaDescription,
      ogImage,
      keywords,
    },
  });

  if (!result.success) {
    const issues = (result.error as any).issues || (result.error as any).errors || [];
    return {
      error: issues.map((e: any) => `${e.path?.join(".") || "field"}: ${e.message}`).join(", ") || result.error.message,
    };
  }

  try {
    await connectToDatabase();
    await SiteSettings.findOneAndUpdate({}, result.data, {
      upsert: true,
      new: true,
    });
  } catch (error: any) {
    return { error: error.message || "Failed to update settings." };
  }

  revalidateTag("settings", { expire: 0 });
  revalidatePath("/");
  revalidatePath("/disclosure");
  revalidatePath("/admin/settings");
  return { success: true, message: "Site settings & SEO defaults updated successfully!" };
}
