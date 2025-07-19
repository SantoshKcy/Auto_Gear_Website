const asyncHandler = require("../middleware/async");
const Package = require("../models/Package");

// @desc    Create new package
// @route   POST /api/v1/package
// @access  Admin
exports.createPackage = asyncHandler(async (req, res) => {
    const { title, description, features, price } = req.body;
    const image = req.file?.filename || "";

    const newPackage = await Package.create({
        title,
        description,
        features: JSON.parse(features),
        price,
        image,
    });

    res.status(201).json({
        success: true,
        message: "Package created successfully",
        data: newPackage,
    });
});

// @desc    Get all packages
// @route   GET /api/v1/package
// @access  Public/Admin
exports.getAllPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find();
    res.status(200).json({ success: true, data: packages });
});

// @desc    Get single package
// @route   GET /api/v1/package/:id
// @access  Public/Admin
const mongoose = require("mongoose");

exports.getPackageById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    // Validate ID presence
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid or missing Package ID" });
    }

    const pkg = await Package.findById(id);
    if (!pkg) {
        return res.status(404).json({ success: false, message: "Package not found" });
    }

    res.status(200).json({ success: true, data: pkg });
});


// @desc    Update package
// @route   PUT /api/v1/package/:id
// @access  Admin
exports.updatePackage = asyncHandler(async (req, res) => {
    const { title, description, features, price } = req.body;
    const updateData = {
        title,
        description,
        features: JSON.parse(features),
        price,
    };

    if (req.file) updateData.image = req.file.filename;

    const updated = await Package.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
    });

    if (!updated) {
        return res.status(404).json({ success: false, message: "Package not found" });
    }

    res.status(200).json({ success: true, data: updated });
});

// @desc    Delete package
// @route   DELETE /api/v1/package/:id
// @access  Admin
exports.deletePackage = asyncHandler(async (req, res) => {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) {
        return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.status(200).json({ success: true, message: "Package deleted" });
});
