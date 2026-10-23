import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClickEvent extends Document {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId | string;
  referrer: string;
  userAgent: string;
  ip?: string;
  createdAt: Date;
}

const ClickEventSchema = new Schema<IClickEvent>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    ip: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

ClickEventSchema.index({ productId: 1, createdAt: -1 });

const ClickEvent: Model<IClickEvent> =
  mongoose.models.ClickEvent || mongoose.model<IClickEvent>("ClickEvent", ClickEventSchema);

export default ClickEvent;
