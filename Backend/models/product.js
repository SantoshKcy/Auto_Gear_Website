const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        subcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subcategory",
            required: true,
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
            required: true,
        },
        variants: {
            materials: [{ type: String, trim: true }],
            colors: [{ type: String, trim: true }],
            dimensions: [{ type: String, trim: true }]
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0, // Prevent negative stock
            default: 0
        },
        warranty: {
            type: String,
            trim: true,
        },
        image: [
            {
                type: String, // URLs or filenames of images/videos
                trim: true,
            },
        ],
        tags: {
            type: [String],
            enum: ["Featured", "Best Seller", "Trending"],
            default: [],
        },
        views: {
            type: Number,
            default: 0
        },
        compatibilities: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Compatibility"
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
