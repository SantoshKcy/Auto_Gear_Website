const mongoose = require("mongoose");

const yearSchema = new mongoose.Schema(
    {
        year: {
            type: Number,
            required: true,
        },
        model: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Model",
            required: true,
        },
        customizerAsset: {
            type: String, // path to .glb or .fbx
        },
        vehicleImage: {
            type: String, // preview image
        },

        // Link to customization options
        exteriorOptions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CustomizationOption",
            },
        ],
        interiorOptions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CustomizationOption",
            },
        ],
        packages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Package",
            },
        ],
        stickers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Sticker",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Year", yearSchema);
