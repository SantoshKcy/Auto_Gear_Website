const asyncHandler = require("../middleware/async");
const Brand = require("../models/brand");
const mongoose = require("mongoose");

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res, next) => {
    const brands = await Brand.find();
    res.status(200).json({
        success: true,
        count: brands.length,
        data: brands,
    });
});

// @desc    Get single brand by ID
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid brand ID format" });
    }

    const brand = await Brand.findById(id);
    if (!brand) {
        return res.status(404).json({ message: `Brand not found with id of ${id}` });
    }

    res.status(200).json({
        success: true,
        data: brand,
    });
});

// @desc    Create new brand
// @route   POST /api/v1/brands
// @access  Private (Admin)
exports.createBrand = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body;

    // Check for duplicate brand
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
        return res.status(400).json({ message: "Brand with this name already exists" });
    }

    const brand = await Brand.create({ name, description });

    res.status(201).json({
        success: true,
        message: "Brand created successfully",
        data: brand,
    });
});

// @desc    Update brand
// @route   PUT /api/v1/brands/:id
// @access  Private (Admin)
exports.updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid brand ID format" });
    }

    let brand = await Brand.findById(id);
    if (!brand) {
        return res.status(404).json({ message: `Brand not found with id of ${id}` });
    }

    const { name, description } = req.body;

    brand = await Brand.findByIdAndUpdate(
        id,
        { name, description },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Brand updated successfully",
        data: brand,
    });
});

// @desc    Delete brand
// @route   DELETE /api/v1/brands/:id
// @access  Private (Admin)
exports.deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid brand ID format" });
    }

    const brand = await Brand.findById(id);
    if (!brand) {
        return res.status(404).json({ message: `Brand not found with id of ${id}` });
    }

    await brand.deleteOne();

    res.status(200).json({
        success: true,
        message: "Brand deleted successfully",
    });
});
