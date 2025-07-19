const mongoose = require("mongoose");

const compatibilitySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    make: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Make",
        required: true,
    },
    model: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Model",
        required: true,
    },
    years: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Year",
        
    }],
}, { timestamps: true });

module.exports = mongoose.model("Compatibility", compatibilitySchema);
