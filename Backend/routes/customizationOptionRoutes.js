const express = require("express");
const router = express.Router();
const {
    createCustomizationOption,
    getCustomizationOptions,
    getOptionsByType,
    deleteCustomizationOption,
} = require("../controllers/customizationOptionController");

const { protect, } = require("../middleware/auth");
const upload = require("../middleware/uploads");

// Create customization option (Admin only)
router.post(
    "/",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "asset", maxCount: 1 }
    ]),
    createCustomizationOption
);

// Get all options
router.get("/", getCustomizationOptions);

// Get options by type (ExteriorColor, Wheel, etc.)
router.get("/type/:type", getOptionsByType);

// Delete a customization option
router.delete("/:id", protect, deleteCustomizationOption);

module.exports = router;
