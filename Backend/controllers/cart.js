const Cart = require("../models/cart");
const Product = require("../models/product");

// @desc    Get Cart by Customer ID
// @route   GET /api/v1/cart/:customerId
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ customerId: req.params.customerId }).populate("products.productId");
        res.json(cart || { customerId: req.params.customerId, products: [] });
    } catch (error) {
        res.status(500).json({ error: "Error fetching cart" });
    }
};

// @desc    Add Product to Cart
// @route   POST /api/v1/cart
exports.addToCart = async (req, res) => {
    const { customerId, productId, quantity = 1, selectedVariant } = req.body;

    try {
        let cart = await Cart.findOne({ customerId });

        if (!cart) {
            cart = new Cart({ customerId, products: [] });
        }

        const existingProduct = cart.products.find(
            (item) =>
                item.productId.toString() === productId &&
                JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
        );

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({
                productId,
                quantity,
                selectedVariant,
            });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error adding product to cart" });
    }
};

// @desc    Update Product Quantity in Cart
// @route   PUT /api/v1/cart
exports.updateCartItem = async (req, res) => {
    const { customerId, productId, quantity, selectedVariant } = req.body;

    try {
        const cart = await Cart.findOne({ customerId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const productItem = cart.products.find(
            (item) =>
                item.productId.toString() === productId &&
                JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
        );

        if (!productItem) return res.status(404).json({ error: "Product not found in cart" });

        productItem.quantity = quantity;
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error updating cart item" });
    }
};

// @desc    Remove Product from Cart
// @route   DELETE /api/v1/cart/remove/:productId
// @query   customerId=<id>&variantKey=<JSON.stringify(selectedVariant)>
exports.removeCartItem = async (req, res) => {
    try {
        const { customerId } = req.query;
        const { productId } = req.params;
        const variantKey = req.query.variantKey; // JSON string of selectedVariant

        const cart = await Cart.findOne({ customerId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.products = cart.products.filter(
            (item) =>
                item.productId.toString() !== productId ||
                JSON.stringify(item.selectedVariant) !== variantKey
        );

        await cart.save();
        res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// @desc    Clear Entire Cart
// @route   DELETE /api/v1/cart/:customerId
exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ customerId: req.params.customerId });
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ error: "Error clearing cart" });
    }
};
