const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    make: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Make",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Model", modelSchema);
