// models/CustomizationSession.js

const mongoose = require("mongoose");

const customizationSessionSchema = new mongoose.Schema(
    {
        customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Customer" }, // Reference Customer instead of User
        year: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Year",
            required: true,
        },
        selectedExterior: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CustomizationOption",
            },
        ],
        selectedInterior: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CustomizationOption",
            },
        ],
        selectedPackages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Package",
            },
        ],
        selectedStickers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Sticker",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("CustomizationSession", customizationSessionSchema);
