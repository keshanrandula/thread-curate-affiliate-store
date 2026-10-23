import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  comparePrice?: number | null;
  currency: string;
  brand: string;
  rating: number;
  affiliateUrl: string;
  affiliateNetwork: string;
  categoryId: mongoose.Types.ObjectId | string;
  tags: string[];
  attributes: Record<string, any>;
  isFeatured: boolean;
  isPublished: boolean;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, default: null },
    currency: { type: String, default: "USD" },
    brand: { type: String, required: true, trim: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    affiliateUrl: { type: String, required: true, trim: true },
    affiliateNetwork: { type: String, required: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: { type: [String], default: [] },
    attributes: { type: Schema.Types.Mixed, default: {} },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    clicks: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ isPublished: 1, isFeatured: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ title: "text", description: "text", brand: "text", tags: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
