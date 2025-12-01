import mongoose from "mongoose";

const CoffeeShopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: {
      type: String,
    },
    vibe: {
      type: String,
      enum: ["Focus", "Social", "Date", "Fast", "Chill"],
    },
    amenities: {
      hasWifi: { type: Boolean, default: false },
      hasPowerOutlets: { type: Boolean, default: false },
      isPetFriendly: { type: Boolean, default: false },
    },
    rating: {
      type: Number,
      min: 1.0,
      max: 5.0,
      default: 5.0,
    },
    images: {
      type: [String],
    },
  },
  { timestamps: true },
);

CoffeeShopSchema.index({ location: "2dsphere" });

export default mongoose.model("CoffeeShop", CoffeeShopSchema);
