import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  siteName: string;
  logo: string;
  heroTitle: string;
  heroSubtitle: string;
  disclosureText: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    pinterest?: string;
    youtube?: string;
  };
  seoDefaults?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    keywords?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: "LUXE AFFILIATE" },
    logo: { type: String, default: "" },
    heroTitle: { type: String, default: "Curated Style, Handpicked Deals" },
    heroSubtitle: {
      type: String,
      default: "Discover premier fashion and wardrobe essentials across the world's best designer brands and verified retailers.",
    },
    disclosureText: {
      type: String,
      default:
        "Disclosure: When you click on links and buy products through our site, we may earn an affiliate commission at no extra cost to you. We only recommend products we genuinely love and verify.",
    },
    socialLinks: {
      twitter: { type: String, default: "https://twitter.com" },
      instagram: { type: String, default: "https://instagram.com" },
      facebook: { type: String, default: "https://facebook.com" },
      pinterest: { type: String, default: "https://pinterest.com" },
      youtube: { type: String, default: "https://youtube.com" },
    },
    seoDefaults: {
      metaTitle: { type: String, default: "THREAD & CURATE | Curated Fashion & Deals" },
      metaDescription: {
        type: String,
        default: "Discover verified luxury deals, apparel, and style essentials curated daily.",
      },
      ogImage: { type: String, default: "" },
      keywords: { type: String, default: "fashion, luxury, apparel, style deals, affiliate shopping" },
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
