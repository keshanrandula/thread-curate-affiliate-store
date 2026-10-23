import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "../lib/seed-data";

dotenv.config({ path: ".env.local" });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/affiliate_shop";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    parentId: { type: mongoose.Schema.Types.Mixed, default: null },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    price: { type: Number, required: true },
    comparePrice: { type: Number, default: null },
    currency: { type: String, default: "USD" },
    brand: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    affiliateUrl: { type: String, required: true },
    affiliateNetwork: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    tags: { type: [String], default: [] },
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Admin" },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const SiteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "THREAD & CURATE" },
    logo: { type: String, default: "" },
    heroTitle: { type: String, default: "The Best Fashion Deals, Hand-Curated Daily" },
    heroSubtitle: {
      type: String,
      default:
        "Browse verified apparel, footwear, and accessories from global designer brands and vetted top-tier affiliate stores.",
    },
    disclosureText: {
      type: String,
      default:
        "Affiliate Disclosure: We curate independent fashion recommendations. When you purchase through links on our site, we may earn an affiliate commission at no extra cost to you.",
    },
    socialLinks: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);
const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);

export async function runSeed() {
  console.log("🌱 Starting MongoDB seed process...");
  console.log(`Target URI: ${MONGODB_URI}`);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully!");

    // Clear existing collections
    await Category.deleteMany({});
    await Product.deleteMany({});
    await AdminUser.deleteMany({});
    await SiteSettings.deleteMany({});
    console.log("Cleared old database records.");

    // Seed Categories
    console.log("Inserting categories...");
    const categoryMap = new Map();
    for (const catData of SEED_CATEGORIES) {
      const cat = await Category.create(catData);
      categoryMap.set(cat.slug, cat._id);
      console.log(`  + Category: ${cat.name} (${cat._id})`);
    }

    // Seed Products
    console.log("Inserting 24 demo clothes products...");
    for (const prodData of SEED_PRODUCTS) {
      const { categorySlug, ...rest } = prodData;
      const categoryId = categoryMap.get(categorySlug);
      if (!categoryId) {
        console.warn(`Category slug not found: ${categorySlug}`);
        continue;
      }

      const prod = await Product.create({
        ...rest,
        categoryId,
      });
      console.log(`  + Product: ${prod.title} [${prod.brand}] -> $${prod.price}`);
    }

    // Seed Admin User from environment variables
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@affiliate.com").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    console.log(`Creating admin account from env variables (${adminEmail})...`);
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const adminUser = await AdminUser.create({
      email: adminEmail,
      passwordHash,
      name: "Site Administrator",
      role: "admin",
    });
    console.log(`  + Admin created: ${adminUser.email} (hashed with bcrypt)`);

    // Seed Site Settings
    console.log("Creating default site settings...");
    await SiteSettings.create({
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
        metaTitle: "THREAD & CURATE | Curated Fashion Deals",
        metaDescription: "Browse verified apparel, footwear, and accessories from global designer brands.",
        ogImage: "",
        keywords: "fashion, luxury deals, clothing, verified affiliate",
      },
    });

    console.log("\n🎉 SEEDING COMPLETED SUCCESSFULLY!");
    console.log("-----------------------------------------");
    console.log("Categories seeded: 4 (Men, Women, Kids, Accessories)");
    console.log("Products seeded:   24 (Verified clothes deals)");
    console.log(`Admin credentials: ${adminEmail} / ${adminPassword}`);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
}

// Only run automatically when executed directly via node/tsx CLI
runSeed();
