const mongoose = require("mongoose");

const stickerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["predefined", "upload", "text"],
      required: true,
    },

    // For predefined/upload stickers
    image: {
      type: String, // file path or URL
      trim: true,
    },

    // For text stickers
    text: {
      type: String,
      trim: true,
    },
    fontFamily: {
      type: String,
      trim: true,
    },
    fontSize: {
      type: Number,
    },
    fontColor: {
      type: String, // hex color code
      trim: true,
    },

    // Transformations (common for all)
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 },
    },
    rotation: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 },
    },
    scale: {
      x: { type: Number, default: 1 },
      y: { type: Number, default: 1 },
      z: { type: Number, default: 1 },
    },
    layerIndex: {
  type: Number,
  default: 0,
},
opacity: {
  type: Number,
  min: 0,
  max: 1,
  default: 1,
},


  },
  { timestamps: true }
);

module.exports = mongoose.model("Sticker", stickerSchema);
