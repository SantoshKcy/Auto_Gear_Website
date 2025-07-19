const express = require("express");
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} = require("../controllers/cart");

router.get("/:customerId", getCart);
router.post("/", addToCart);
router.put("/", updateCartItem);
router.delete("/remove/:productId", removeCartItem);
router.delete("/:customerId", clearCart);

module.exports = router;
