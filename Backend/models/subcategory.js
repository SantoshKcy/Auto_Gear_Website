const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category", // Reference to Category model
        required: true,
    },

}, { timestamps: true });

module.exports = mongoose.model("Subcategory", subcategorySchema);