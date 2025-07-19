const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Customer" }, // Reference Customer instead of User
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
});

module.exports = mongoose.model("Wishlist", WishlistSchema);