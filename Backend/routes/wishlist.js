const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist");

router.post("/add", wishlistController.addToWishlist);
router.delete("/remove/:productId", wishlistController.removeFromWishlist);
router.delete("/:customerId", wishlistController.clearWishlist);
router.get("/check/:productId", wishlistController.checkWishlistStatus);
router.get("/customer/:customerId", wishlistController.getCustomerWishlist);

module.exports = router;