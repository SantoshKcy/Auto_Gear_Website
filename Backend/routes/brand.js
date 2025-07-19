const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
    createBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand
} = require("../controllers/brand");

// Routes for brand
router.post("/createBrand", createBrand);
router.get("/getBrands", getBrands);
router.get("/getBrand/:id", getBrand);
router.put("/updateBrand/:id", updateBrand);
router.delete("/deleteBrand/:id", deleteBrand);

module.exports = router;
