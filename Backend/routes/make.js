const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
    createMake,
    getMakes,
    getMake,
    updateMake,
    deleteMake
} = require("../controllers/make");

// Routes for make
router.post("/createMake", createMake);
router.get("/getMakes", getMakes);
router.get("/getMake/:id", getMake);
router.put("/updateMake/:id", protect, updateMake);
router.delete("/deleteMake/:id", protect, deleteMake);

module.exports = router;
