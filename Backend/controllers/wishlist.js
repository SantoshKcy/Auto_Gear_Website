const Wishlist = require("../models/wishlist");

// ✅ Add product to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { customerId, productId } = req.body;

        // Check if product is already in wishlist
        const existingproduct = await Wishlist.findOne({ customerId, productId });

        if (existingproduct) {
            return res.status(400).json({ message: "product already in wishlist" });
        }

        const wishlistproduct = new Wishlist({ customerId, productId });
        await wishlistproduct.save();

        res.status(200).json({ message: "Added to wishlist", wishlistproduct });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ❌ Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { customerId } = req.query;
        const { productId } = req.params;

        await Wishlist.findOneAndDelete({ customerId, productId });

        res.status(200).json({ message: "Removed from wishlist", Wishlist });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// exports.removeFromWishlist = async (req, res) => {
//     try {
//         const { customerId } = req.query;  // Get customerId from query params
//         const { productId } = req.params;     // Get productId from route params

//         // Remove the wishlist entry that matches both customerId and productId
//         const result = await Wishlist.findOneAndDelete({ customerId, productId });

//         if (!result) {
//             return res.status(404).json({ message: "product not found in wishlist" });
//         }

//         res.status(200).json({ message: "product removed from wishlist" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };


// ✅ Check if product is in wishlist
exports.checkWishlistStatus = async (req, res) => {
    try {
        const { customerId } = req.query;
        const { productId } = req.params;

        const exists = await Wishlist.findOne({ customerId, productId });

        res.status(200).json({ isWishlisted: !!exists });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Get all wishlist products for a customer
exports.getCustomerWishlist = async (req, res) => {
    try {
        const { customerId } = req.params;
        const wishlistproducts = await Wishlist.find({ customerId }).populate("productId");

        res.status(200).json({ wishlist: wishlistproducts });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.clearWishlist = async (req, res) => {
    try {
        await Wishlist.findOneAndDelete({ customerId: req.params.customerId });
        res.json({ message: "Wishlist cleared" });
    } catch (error) {
        res.status(500).json({ error: "Error clearing wishlist" });
    }
};