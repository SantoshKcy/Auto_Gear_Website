const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");
const { protect, authorize } = require("../middleware/auth");

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getItemsByTag,
    getMostViewedProducts,
    getFilteredProducts,
} = require("../controllers/product");

// Public routes
router.get("/", getProducts);
router.get("/product", getItemsByTag);  // maybe rename to /by-tag or clarify usage?
router.get("/most-viewed", getMostViewedProducts);

// Place filter route before :id param to avoid route conflicts
router.get("/filter", getFilteredProducts);

// Single product by id should be last to avoid conflict with other routes
router.get("/:id", getProduct);

// Protected admin routes
router.post("/createProduct", protect, authorize("admin"), upload.array("images", 10), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;
