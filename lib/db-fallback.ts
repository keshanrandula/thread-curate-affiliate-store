import { SEED_CATEGORIES, SEED_PRODUCTS } from "@/lib/seed-data";

export interface DemoCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DemoProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  comparePrice: number | null;
  currency: string;
  brand: string;
  rating: number;
  affiliateUrl: string;
  affiliateNetwork: string;
  categoryId: string;
  category?: DemoCategory;
  tags: string[];
  attributes: Record<string, any>;
  isFeatured: boolean;
  isPublished: boolean;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

// Generate deterministic IDs for demo data
export const FALLBACK_CATEGORIES: DemoCategory[] = SEED_CATEGORIES.map((c, i) => ({
  _id: `cat_demo_${i + 1}`,
  name: c.name,
  slug: c.slug,
  description: c.description,
  image: c.image,
  parentId: null,
  sortOrder: c.sortOrder,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const categoryMap = new Map(FALLBACK_CATEGORIES.map((c) => [c.slug, c]));

export const FALLBACK_PRODUCTS: DemoProduct[] = SEED_PRODUCTS.map((p, i) => {
  const cat = categoryMap.get(p.categorySlug) || FALLBACK_CATEGORIES[0];
  return {
    _id: `prod_demo_${i + 1}`,
    title: p.title,
    slug: p.slug,
    description: p.description,
    images: p.images,
    price: p.price,
    comparePrice: p.comparePrice ?? null,
    currency: p.currency,
    brand: p.brand,
    rating: p.rating,
    affiliateUrl: p.affiliateUrl,
    affiliateNetwork: p.affiliateNetwork,
    categoryId: cat._id,
    category: cat,
    tags: p.tags,
    attributes: p.attributes,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished,
    clicks: p.clicks,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

export const FALLBACK_SETTINGS = {
  siteName: "THREAD & CURATE",
  logo: "",
  heroTitle: "The Best Fashion Deals, Hand-Curated Daily",
  heroSubtitle:
    "Browse verified apparel, footwear, and accessories from global designer brands and vetted top-tier affiliate stores.",
  disclosureText:
    "Affiliate Disclosure: We curate independent fashion recommendations. When you purchase through links on our site, we may earn an affiliate commission at no extra cost to you.",
  socialLinks: {
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    pinterest: "https://pinterest.com",
    youtube: "https://youtube.com",
  },
  seoDefaults: {
    metaTitle: "THREAD & CURATE | Curated Fashion & Deals",
    metaDescription: "Discover verified luxury deals, apparel, and style essentials curated daily.",
    ogImage: "",
    keywords: "fashion, luxury, apparel, style deals, affiliate shopping",
  },
};
