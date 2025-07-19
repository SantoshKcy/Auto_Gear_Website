const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
    createCompatibility,
    getCompatibilities,
    getCompatibility,
    updateCompatibility,
    deleteCompatibility
} = require("../controllers/compatibility");

// Public routes
router.get("/getCompatibilities", getCompatibilities);
router.get("/getCompatibility/:id", getCompatibility);

// Protected admin routes
router.post("/createCompatibility", createCompatibility);
router.put("/updateCompatibility/:id", protect, updateCompatibility);
router.delete("/deleteCompatibility/:id", protect, deleteCompatibility);

module.exports = router;
