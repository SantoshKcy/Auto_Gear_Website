const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        features: [
            {
                type: String, // list of features included in the package
                trim: true,
            },
        ],
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String, // optional thumbnail or preview image
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
