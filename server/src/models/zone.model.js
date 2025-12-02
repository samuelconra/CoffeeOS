import mongoose from "mongoose";

const ZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Polygon"],
        required: true,
      },
      coordinates: {
        type: [[[Number]]],
        required: true,
      },
    },
  },
  { timestamps: true }
);

ZoneSchema.index({ location: "2dsphere" });

export default mongoose.model("Zone", ZoneSchema);