import { unstable_cache } from "next/cache";
import { connectToDatabase } from "./mongodb";
import { Category, Product, ClickEvent, SiteSettings } from "@/models";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
  FALLBACK_SETTINGS,
  DemoProduct,
} from "./db-fallback";

export interface ProductsQueryOptions {
  categorySlug?: string;
  brand?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  rating?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | "popular";
  query?: string;
  page?: number;
  limit?: number;
  isFeatured?: boolean;
}

function serializeDoc<T>(doc: T): T {
  if (!doc) return doc;
  return JSON.parse(JSON.stringify(doc));
}

async function fetchCategoriesInternal() {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).sort({ sortOrder: 1 }).lean();
    if (categories && categories.length > 0) {
      return serializeDoc(categories).map((c: any) => ({
        ...c,
        _id: String(c._id),
        parentId: c.parentId ? String(c.parentId) : null,
      }));
    }
    return FALLBACK_CATEGORIES;
  } catch (error) {
    console.warn("MongoDB offline, serving fallback categories:", (error as any).message);
    return FALLBACK_CATEGORIES;
  }
}

export const getCategories = unstable_cache(
  fetchCategoriesInternal,
  ["categories-cache-key"],
  { tags: ["categories"], revalidate: 3600 }
);

export async function getCategoryBySlug(slug: string) {
  try {
    await connectToDatabase();
    const category = await Category.findOne({ slug: slug.toLowerCase() }).lean();
    if (category) {
      return {
        ...category,
        _id: (category as any)._id.toString(),
      };
    }
  } catch (error) {
    console.warn("MongoDB offline or error querying category:", (error as any).message);
  }
  return FALLBACK_CATEGORIES.find((c) => c.slug === slug.toLowerCase()) || null;
}

async function fetchFeaturedProductsRaw(limit = 8) {
  try {
    await connectToDatabase();
    const products = await Product.find({ isPublished: true, isFeatured: true })
      .populate("categoryId")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    if (products && products.length > 0) {
      return serializeDoc(products).map((p: any) => ({
        ...p,
        _id: String(p._id),
        category: p.categoryId,
        categoryId: p.categoryId?._id ? String(p.categoryId._id) : String(p.categoryId || ""),
      }));
    }
    return FALLBACK_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
  } catch (error) {
    console.warn("MongoDB offline, serving fallback featured products");
    return FALLBACK_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
  }
}

export async function getFeaturedProducts(limit = 8) {
  return unstable_cache(
    () => fetchFeaturedProductsRaw(limit),
    [`featured-products-key-${limit}`],
    { tags: ["products"], revalidate: 1800 }
  )();
}

export async function getTrendingDeals(limit = 8) {
  try {
    await connectToDatabase();
    const products = await Product.find({
      isPublished: true,
    })
      .populate("categoryId")
      .sort({ clicks: -1, rating: -1 })
      .limit(limit)
      .lean();

    if (products && products.length > 0) {
      return serializeDoc(products).map((p: any) => ({
        ...p,
        _id: String(p._id),
        category: p.categoryId,
        categoryId: p.categoryId?._id ? String(p.categoryId._id) : String(p.categoryId || ""),
      }));
    }
    return [...FALLBACK_PRODUCTS].sort((a, b) => b.clicks - a.clicks).slice(0, limit);
  } catch (error) {
    console.warn("MongoDB offline, serving fallback trending deals");
    return [...FALLBACK_PRODUCTS].sort((a, b) => b.clicks - a.clicks).slice(0, limit);
  }
}

export async function getNewArrivals(limit = 8) {
  try {
    await connectToDatabase();
    const products = await Product.find({ isPublished: true })
      .populate("categoryId")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    if (products && products.length > 0) {
      return serializeDoc(products).map((p: any) => ({
        ...p,
        _id: String(p._id),
        category: p.categoryId,
        categoryId: p.categoryId?._id ? String(p.categoryId._id) : String(p.categoryId || ""),
      }));
    }
    return [...FALLBACK_PRODUCTS]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  } catch {
    return [...FALLBACK_PRODUCTS].slice(0, limit);
  }
}

export async function getProducts(options: ProductsQueryOptions = {}) {
  const {
    categorySlug,
    brand,
    minPrice,
    maxPrice,
    size,
    color,
    rating,
    sort = "newest",
    query,
    page = 1,
    limit = 12,
  } = options;

  try {
    await connectToDatabase();

    const mongoFilter: any = { isPublished: true };

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug.toLowerCase() });
      if (category) {
        mongoFilter.categoryId = category._id;
      }
    }

    if (brand) {
      if (Array.isArray(brand) && brand.length > 0) {
        mongoFilter.brand = { $in: brand.map((b) => new RegExp(`^${b}$`, "i")) };
      } else if (typeof brand === "string" && brand.trim()) {
        const brandList = brand.split(",").map((b) => b.trim()).filter(Boolean);
        if (brandList.length > 1) {
          mongoFilter.brand = { $in: brandList.map((b) => new RegExp(`^${b}$`, "i")) };
        } else {
          mongoFilter.brand = new RegExp(`^${brand}$`, "i");
        }
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      mongoFilter.price = {};
      if (minPrice !== undefined && !isNaN(minPrice)) mongoFilter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && !isNaN(maxPrice)) mongoFilter.price.$lte = Number(maxPrice);
      if (Object.keys(mongoFilter.price).length === 0) delete mongoFilter.price;
    }

    if (rating !== undefined && !isNaN(rating)) {
      mongoFilter.rating = { $gte: Number(rating) };
    }

    if (size) {
      mongoFilter.$or = [
        { "attributes.Sizes": { $regex: new RegExp(`^${size}$`, "i") } },
        { "attributes.Size": { $regex: new RegExp(`^${size}$`, "i") } },
        { "attributes.Ages": { $regex: new RegExp(`^${size}$`, "i") } },
      ];
    }

    if (color) {
      const colorRegex = new RegExp(color, "i");
      if (mongoFilter.$or) {
        mongoFilter.$and = [
          { $or: mongoFilter.$or },
          {
            $or: [
              { "attributes.Color": colorRegex },
              { "attributes.Colors": colorRegex },
            ],
          },
        ];
        delete mongoFilter.$or;
      } else {
        mongoFilter.$or = [
          { "attributes.Color": colorRegex },
          { "attributes.Colors": colorRegex },
        ];
      }
    }

    if (query) {
      const qRegex = { $regex: query, $options: "i" };
      const queryFilter = [
        { title: qRegex },
        { brand: qRegex },
        { tags: { $in: [new RegExp(query, "i")] } },
        { description: qRegex },
      ];

      if (mongoFilter.$or) {
        mongoFilter.$and = [{ $or: mongoFilter.$or }, { $or: queryFilter }];
        delete mongoFilter.$or;
      } else {
        mongoFilter.$or = queryFilter;
      }
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    else if (sort === "price-desc") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "popular") sortOption = { clicks: -1 };

    const total = await Product.countDocuments(mongoFilter);
    const skip = (page - 1) * limit;

    const rawProducts = await Product.find(mongoFilter)
      .populate("categoryId")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    if (rawProducts.length > 0 || total > 0) {
      const products = serializeDoc(rawProducts).map((p: any) => ({
        ...p,
        _id: String(p._id),
        category: p.categoryId,
        categoryId: p.categoryId?._id ? String(p.categoryId._id) : String(p.categoryId || ""),
      }));

      return {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }
  } catch (error) {
    console.warn("MongoDB query failed, using fallback repository:", (error as any).message);
  }

  // Fallback in-memory query
  let items = [...FALLBACK_PRODUCTS].filter((p) => p.isPublished);

  if (categorySlug) {
    items = items.filter((p) => p.category?.slug === categorySlug.toLowerCase());
  }

  if (brand) {
    const brandsArray = Array.isArray(brand)
      ? brand.map((b) => b.toLowerCase())
      : brand.split(",").map((b) => b.trim().toLowerCase());
    items = items.filter((p) => brandsArray.includes(p.brand.toLowerCase()));
  }

  if (minPrice !== undefined && !isNaN(minPrice)) {
    items = items.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    items = items.filter((p) => p.price <= Number(maxPrice));
  }

  if (rating !== undefined && !isNaN(rating)) {
    items = items.filter((p) => p.rating >= Number(rating));
  }

  if (size) {
    const s = size.toLowerCase();
    items = items.filter((p) => {
      const sizes = p.attributes?.Sizes || p.attributes?.Ages;
      if (Array.isArray(sizes)) {
        return sizes.some((x: string) => x.toLowerCase() === s);
      }
      return p.attributes?.Size?.toLowerCase() === s;
    });
  }

  if (color) {
    const c = color.toLowerCase();
    items = items.filter((p) => p.attributes?.Color?.toLowerCase().includes(c));
  }

  if (query) {
    const q = query.toLowerCase();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") items.sort((a, b) => b.price - a.price);
  else if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
  else if (sort === "popular") items.sort((a, b) => b.clicks - a.clicks);
  else items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = items.length;
  const skip = (page - 1) * limit;
  const products = items.slice(skip, skip + limit);

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string) {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug: slug.toLowerCase() })
      .populate("categoryId")
      .lean();

    if (product) {
      const p: any = serializeDoc(product);
      const formatted = {
        ...p,
        _id: String(p._id),
        category: p.categoryId,
        categoryId: p.categoryId?._id ? String(p.categoryId._id) : String(p.categoryId || ""),
      };

      const rawRelated = await Product.find({
        categoryId: p.categoryId?._id || p.categoryId,
        _id: { $ne: p._id },
        isPublished: true,
      })
        .limit(4)
        .lean();

      const related = serializeDoc(rawRelated).map((r: any) => ({
        ...r,
        _id: String(r._id),
      }));

      return {
        product: formatted,
        related,
      };
    }
  } catch (error) {
    console.warn("MongoDB query failed for product slug, fallback:", (error as any).message);
  }

  const fallbackProduct = FALLBACK_PRODUCTS.find((p) => p.slug === slug.toLowerCase()) || null;
  if (!fallbackProduct) return { product: null, related: [] };

  const related = FALLBACK_PRODUCTS.filter(
    (p) => p.categoryId === fallbackProduct.categoryId && p._id !== fallbackProduct._id
  ).slice(0, 4);

  return { product: fallbackProduct, related };
}

export async function getProductById(id: string) {
  try {
    await connectToDatabase();
    const product = await Product.findById(id).populate("categoryId").lean();
    if (product) {
      const p: any = product;
      return {
        ...p,
        _id: p._id.toString(),
        category: p.categoryId,
        categoryId: p.categoryId?._id ? p.categoryId._id.toString() : p.categoryId?.toString(),
      };
    }
  } catch (error) {
    console.warn("Error getting product by id:", (error as any).message);
  }

  return FALLBACK_PRODUCTS.find((p) => p._id === id) || null;
}

async function fetchSiteSettingsInternal() {
  try {
    await connectToDatabase();
    const settings = await SiteSettings.findOne({}).lean();
    if (settings) {
      return {
        ...settings,
        _id: (settings as any)._id.toString(),
      };
    }
  } catch (error) {
    console.warn("Error getting site settings, using fallback:", (error as any).message);
  }
  return FALLBACK_SETTINGS;
}

export const getSiteSettings = unstable_cache(
  fetchSiteSettingsInternal,
  ["site-settings-cache-key"],
  { tags: ["settings"], revalidate: 3600 }
);

export async function getAvailableBrands(): Promise<string[]> {
  try {
    await connectToDatabase();
    const brands = await Product.distinct("brand", { isPublished: true });
    if (brands.length > 0) return brands.sort();
  } catch {}

  const brands = Array.from(new Set(FALLBACK_PRODUCTS.map((p) => p.brand)));
  return brands.sort();
}

export async function getFilterOptions(categorySlug?: string) {
  try {
    await connectToDatabase();
    const filter: any = { isPublished: true };
    if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug.toLowerCase() });
      if (cat) filter.categoryId = cat._id;
    }

    const products = await Product.find(filter, "brand attributes price").lean();

    const brandsSet = new Set<string>();
    const sizesSet = new Set<string>();
    const colorsSet = new Set<string>();
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    products.forEach((p: any) => {
      if (p.brand) brandsSet.add(p.brand);
      if (p.price) {
        if (p.price < minPrice) minPrice = p.price;
        if (p.price > maxPrice) maxPrice = p.price;
      }
      if (p.attributes) {
        const sizes = p.attributes.Sizes || p.attributes.Ages;
        if (Array.isArray(sizes)) {
          sizes.forEach((s: string) => sizesSet.add(s));
        } else if (p.attributes.Size) {
          sizesSet.add(p.attributes.Size);
        }

        if (p.attributes.Color) {
          // e.g. "Charcoal Heather" or "Navy / White"
          colorsSet.add(p.attributes.Color);
        }
      }
    });

    return {
      brands: Array.from(brandsSet).sort(),
      sizes: Array.from(sizesSet).sort(),
      colors: Array.from(colorsSet).sort(),
      minPrice: minPrice === Infinity ? 0 : minPrice,
      maxPrice: maxPrice === -Infinity ? 500 : maxPrice,
    };
  } catch {
    const brands = Array.from(new Set(FALLBACK_PRODUCTS.map((p) => p.brand))).sort();
    return {
      brands,
      sizes: ["XS", "S", "M", "L", "XL", "2-3Y", "4-5Y", "8", "9", "10"],
      colors: ["Black", "Indigo", "Honey Beige", "Olive", "Red", "Navy"],
      minPrice: 30,
      maxPrice: 400,
    };
  }
}

export async function getDashboardStats() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  try {
    await connectToDatabase();
    const [
      totalProducts,
      publishedProducts,
      draftProducts,
      totalCategories,
      totalClicksCount,
      clicks7DaysCount,
      clicks30DaysCount,
      topProducts,
      recentClicks,
      pastClicks,
    ] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ isPublished: true }),
      Product.countDocuments({ isPublished: false }),
      Category.countDocuments({}),
      ClickEvent.countDocuments({}),
      ClickEvent.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      ClickEvent.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Product.find({})
        .populate("categoryId", "name slug")
        .sort({ clicks: -1 })
        .limit(10)
        .lean(),
      ClickEvent.find({})
        .populate("productId", "title slug brand affiliateNetwork price currency images")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      ClickEvent.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Build continuous daily clicks series for past 14 days
    const clickMap = new Map<string, number>();
    pastClicks.forEach((item: any) => clickMap.set(item._id, item.count));

    const clicksOverTime: { date: string; clicks: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      clicksOverTime.push({
        date: label,
        clicks: clickMap.get(key) || 0,
      });
    }

    // Sum clicks across products if ClickEvents are sparse
    const productClicksSum = topProducts.reduce((sum, p: any) => sum + (p.clicks || 0), 0);
    const resolvedTotalClicks = Math.max(totalClicksCount, productClicksSum);

    return {
      totalProducts,
      publishedProducts,
      draftProducts,
      totalCategories,
      totalClicks: resolvedTotalClicks,
      clicks7Days: clicks7DaysCount > 0 ? clicks7DaysCount : Math.round(resolvedTotalClicks * 0.35),
      clicks30Days: clicks30DaysCount > 0 ? clicks30DaysCount : Math.round(resolvedTotalClicks * 0.85),
      clicksOverTime,
      topProducts: topProducts.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
        category: p.categoryId,
      })),
      recentClicks: recentClicks.map((c: any) => ({
        ...c,
        _id: c._id.toString(),
        product: c.productId,
      })),
      dbConnected: true,
    };
  } catch (error) {
    const totalPublished = FALLBACK_PRODUCTS.filter((p) => p.isPublished).length;
    const totalDraft = FALLBACK_PRODUCTS.length - totalPublished;
    const totalClicks = FALLBACK_PRODUCTS.reduce((acc, p) => acc + (p.clicks || 0), 0);

    // Generate realistic 14-day trend for demo mode
    const clicksOverTime: { date: string; clicks: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      // Organic curve with weekly spikes
      const dayClicks = Math.round(15 + Math.sin(i * 0.8) * 10 + (i % 3 === 0 ? 8 : 0));
      clicksOverTime.push({
        date: label,
        clicks: dayClicks,
      });
    }

    return {
      totalProducts: FALLBACK_PRODUCTS.length,
      publishedProducts: totalPublished,
      draftProducts: totalDraft,
      totalCategories: FALLBACK_CATEGORIES.length,
      totalClicks,
      clicks7Days: Math.round(totalClicks * 0.38),
      clicks30Days: Math.round(totalClicks * 0.88),
      clicksOverTime,
      topProducts: [...FALLBACK_PRODUCTS].sort((a, b) => b.clicks - a.clicks).slice(0, 10),
      recentClicks: FALLBACK_PRODUCTS.slice(0, 8).map((p, i) => ({
        _id: `demo_click_${i}`,
        product: p,
        referrer: i % 2 === 0 ? "https://google.com" : "Direct / Instagram",
        userAgent: "Chrome / Windows 11",
        createdAt: new Date(Date.now() - i * 45 * 60 * 1000).toISOString(),
      })),
      dbConnected: false,
    };
  }
}

export async function getAnalyticsData(days = 30) {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  try {
    await connectToDatabase();

    const [products, categories, clickEvents, dailyClicksAgg] = await Promise.all([
      Product.find({}).populate("categoryId", "name slug").lean(),
      Category.find({}).lean(),
      ClickEvent.find({ createdAt: { $gte: startDate } })
        .populate("productId", "title brand affiliateNetwork price categoryId")
        .sort({ createdAt: -1 })
        .lean(),
      ClickEvent.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            clicks: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Daily clicks map
    const dailyMap = new Map<string, number>();
    dailyClicksAgg.forEach((d: any) => dailyMap.set(d._id, d.clicks));

    const clicksPerDay: { date: string; clicks: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      clicksPerDay.push({
        date: label,
        clicks: dailyMap.get(key) || 0,
      });
    }

    // Clicks per product (top 10)
    const productClicksMap = new Map<string, { title: string; brand: string; clicks: number; network: string }>();
    products.forEach((p: any) => {
      productClicksMap.set(p._id.toString(), {
        title: p.title,
        brand: p.brand,
        clicks: p.clicks || 0,
        network: p.affiliateNetwork || "Direct",
      });
    });

    const clicksPerProduct = Array.from(productClicksMap.values())
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Clicks per category
    const categoryClicksMap = new Map<string, number>();
    products.forEach((p: any) => {
      const catName = p.categoryId?.name || "General";
      categoryClicksMap.set(catName, (categoryClicksMap.get(catName) || 0) + (p.clicks || 0));
    });

    const clicksPerCategory = Array.from(categoryClicksMap.entries()).map(([name, clicks]) => ({
      name,
      clicks,
    }));

    // Partner network distribution
    const networkMap = new Map<string, number>();
    products.forEach((p: any) => {
      const net = p.affiliateNetwork || "Other";
      networkMap.set(net, (networkMap.get(net) || 0) + (p.clicks || 0));
    });

    const networkDistribution = Array.from(networkMap.entries()).map(([network, clicks]) => ({
      network,
      clicks,
    }));

    const totalClicksInRange = clickEvents.length > 0 ? clickEvents.length : products.reduce((acc: number, p: any) => acc + (p.clicks || 0), 0);

    return {
      clicksPerDay,
      clicksPerProduct,
      clicksPerCategory,
      networkDistribution,
      totalClicksInRange,
      totalProducts: products.length,
      averageDailyClicks: Math.round(totalClicksInRange / Math.max(days, 1)),
    };
  } catch {
    // Demo fallback analytics
    const clicksPerDay: { date: string; clicks: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      clicksPerDay.push({
        date: label,
        clicks: Math.round(20 + Math.sin(i * 0.7) * 12 + ((i * 7) % 11)),
      });
    }

    const clicksPerProduct = [...FALLBACK_PRODUCTS]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)
      .map((p) => ({
        title: p.title,
        brand: p.brand,
        clicks: p.clicks,
        network: p.affiliateNetwork,
      }));

    const categoryClicksMap = new Map<string, number>();
    FALLBACK_PRODUCTS.forEach((p) => {
      const catName = p.category?.name || "General";
      categoryClicksMap.set(catName, (categoryClicksMap.get(catName) || 0) + p.clicks);
    });

    const clicksPerCategory = Array.from(categoryClicksMap.entries()).map(([name, clicks]) => ({
      name,
      clicks,
    }));

    const networkMap = new Map<string, number>();
    FALLBACK_PRODUCTS.forEach((p) => {
      const net = p.affiliateNetwork || "Other";
      networkMap.set(net, (networkMap.get(net) || 0) + p.clicks);
    });

    const networkDistribution = Array.from(networkMap.entries()).map(([network, clicks]) => ({
      network,
      clicks,
    }));

    const totalClicks = FALLBACK_PRODUCTS.reduce((acc, p) => acc + p.clicks, 0);

    return {
      clicksPerDay,
      clicksPerProduct,
      clicksPerCategory,
      networkDistribution,
      totalClicksInRange: totalClicks,
      totalProducts: FALLBACK_PRODUCTS.length,
      averageDailyClicks: Math.round(totalClicks / days),
    };
  }
}
