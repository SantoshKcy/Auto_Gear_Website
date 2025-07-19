const mongoose = require("mongoose");

const customizationOptionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "exterior-hood",
        "exterior-handle",
        "exterior-rim",
        "exterior-front-bumper",
        "exterior-rear-bumper",
        "exterior-roof-panel",
        "exterior-door",
        "exterior-mirror",
        "exterior-spoiler",
        "interior-seat-cushion",
        "interior-seat-base",
        "interior-dashboard-trim",
        "interior-sound-system"
      ],
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String, // filename or image URL (for preview)
    },
    colorCode: {
      type: String, // optional hex color (e.g., #FF0000)
    },
    asset: {
      type: String, // optional .glb if this variant needs its own 3D override
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomizationOption", customizationOptionSchema);
