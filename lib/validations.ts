import { z } from "zod";

export const ProductInputSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().default(""),
  images: z.array(z.string()).min(1, "At least one image URL is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  comparePrice: z.coerce
    .number()
    .positive("Compare price must be positive")
    .nullable()
    .optional(),
  currency: z.string().default("USD"),
  brand: z.string().min(1, "Brand name is required"),
  rating: z.coerce.number().min(0).max(5).default(4.5),
  affiliateUrl: z.string().url("Must be a valid affiliate URL"),
  affiliateNetwork: z.string().min(1, "Affiliate network name is required"),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  attributes: z.record(z.string(), z.any()).default({}),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof ProductInputSchema>;

export const CategoryInputSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional().default(""),
  image: z.string().optional().default(""),
  parentId: z.string().nullable().optional().default(null),
  sortOrder: z.coerce.number().default(0),
});

export type CategoryInput = z.infer<typeof CategoryInputSchema>;

export const SiteSettingsInputSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  logo: z.string().optional().default(""),
  heroTitle: z.string().min(1, "Hero title is required"),
  heroSubtitle: z.string().min(1, "Hero subtitle is required"),
  disclosureText: z.string().min(10, "Disclosure text is required for FTC compliance"),
  socialLinks: z
    .object({
      twitter: z.string().optional(),
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      pinterest: z.string().optional(),
      youtube: z.string().optional(),
    })
    .default({}),
  seoDefaults: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogImage: z.string().optional(),
      keywords: z.string().optional(),
    })
    .default({}),
});

export type SiteSettingsInput = z.infer<typeof SiteSettingsInputSchema>;

export const AdminLoginInputSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AdminLoginInput = z.infer<typeof AdminLoginInputSchema>;
