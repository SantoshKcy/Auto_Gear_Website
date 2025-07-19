const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth"); // if you want auth middleware

const {
    getCarModels,
    getCarModel,
    createCarModel,
    updateCarModel,
    deleteCarModel,
} = require("../controllers/CarModel");

// Public routes
router.get("/", getCarModels);
router.get("/:id", getCarModel);

// Protected routes - only admin or authorized users
router.post("/", protect, createCarModel);
router.put("/:id", protect, updateCarModel);
router.delete("/:id", protect, deleteCarModel);

module.exports = router;
