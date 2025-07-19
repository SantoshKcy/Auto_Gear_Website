const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const upload = require("../middleware/uploads");

const {
    createYear,
    getYears,
    getYear,
    updateYear,
    deleteYear,
    getYearsByModel,
    getPackagesByYear,
    getStickersByYear
} = require("../controllers/year");

// Routes for year
router.put(
    '/updateYear/:id',
    upload.fields([
        { name: 'vehicleImage', maxCount: 1 },
        { name: 'customizerAsset', maxCount: 1 }
    ]),

    updateYear
);
router.get("/getYears", getYears);
router.get("/getYear/:id", getYear);
router.post("/createYear/", protect, createYear);
router.delete("/deleteYear/:id", protect, deleteYear);
router.get("/getYearsByModel/:modelId", getYearsByModel);
router.get("/getPackagesByYear/:yearId", getPackagesByYear);
router.get("/getStickersByYear/:yearId", getStickersByYear);


module.exports = router;
