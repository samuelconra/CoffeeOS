import mongoose from "mongoose";

const BeanOriginSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    roaster: {
      type: String,
      required: true,
    },
    originRegion: {
      type: String,
    },
    process: {
      type: String,
      enum: ["Washed", "Natural", "Honey", "Anaerobic", "Experimental"],
    },
    roastLevel: {
      type: String,
      enum: ["Light", "Medium", "Dark"],
    },
    altitude: {
      type: Number,
    },
    priceCup: {
      type: Number,
    },
    coffeeShopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoffeeShop",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("BeanOrigin", BeanOriginSchema);
