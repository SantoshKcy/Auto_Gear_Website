const asyncHandler = require("../middleware/async");
const Compatibility = require("../models/compatibility");
const Product = require("../models/product");
const Make = require("../models/make");
const Model = require("../models/model");
const Year = require("../models/year");
const mongoose = require("mongoose");

// @desc    Get all compatibility entries
// @route   GET /api/v1/compatibility
// @access  Public
exports.getCompatibilities = asyncHandler(async (req, res, next) => {
    const data = await Compatibility.find()
        .populate("product", "name")
        .populate("make", "name")
        .populate("model", "name")
        .populate("years", "year");

    res.status(200).json({
        success: true,
        count: data.length,
        data
    });
});

// @desc    Get compatibility by ID
// @route   GET /api/v1/compatibility/:id
// @access  Public
exports.getCompatibility = asyncHandler(async (req, res, next) => {
    const comp = await Compatibility.findById(req.params.id)
        .populate("product", "name")
        .populate("make", "name")
        .populate("model", "name")
        .populate("years", "year");

    if (!comp) {
        return res.status(404).json({ message: "Compatibility not found" });
    }

    res.status(200).json({
        success: true,
        data: comp
    });
});

// @desc    Create compatibility entry
// @route   POST /api/v1/compatibility
// @access  Private (Admin)
exports.createCompatibility = asyncHandler(async (req, res, next) => {
    const { product, make, model, years } = req.body;

    // Validate references
    const validProduct = await Product.findById(product);
    const validMake = await Make.findById(make);
    const validModel = await Model.findById(model);

    if (!validProduct || !validMake || !validModel) {
        return res.status(400).json({ message: "Invalid product, make, or model" });
    }

    if (!Array.isArray(years) || years.length === 0) {
        return res.status(400).json({ message: "At least one year must be selected" });
    }

    for (const yearId of years) {
        const yearExists = await Year.findById(yearId);
        if (!yearExists) {
            return res.status(400).json({ message: `Invalid year ID: ${yearId}` });
        }
    }

    // Create the compatibility entry
    const compatibility = await Compatibility.create({ product, make, model, years });

    // Update the Product document to include this compatibility
    await Product.findByIdAndUpdate(
        product,
        { $push: { compatibilities: compatibility._id } },
        { new: true, runValidators: true }
    );

    res.status(201).json({
        success: true,
        message: "Compatibility created successfully",
        data: compatibility
    });
});

// @desc    Update compatibility entry
// @route   PUT /api/v1/compatibility/:id
// @access  Private (Admin)
exports.updateCompatibility = asyncHandler(async (req, res, next) => {
    const { product, make, model, years } = req.body;

    let compatibility = await Compatibility.findById(req.params.id);
    if (!compatibility) {
        return res.status(404).json({ message: "Compatibility entry not found" });
    }

    // Optional validation
    if (product) {
        const validProduct = await Product.findById(product);
        if (!validProduct) return res.status(400).json({ message: "Invalid product ID" });
    }
    if (make) {
        const validMake = await Make.findById(make);
        if (!validMake) return res.status(400).json({ message: "Invalid make ID" });
    }
    if (model) {
        const validModel = await Model.findById(model);
        if (!validModel) return res.status(400).json({ message: "Invalid model ID" });
    }
    if (years && Array.isArray(years)) {
        for (const yearId of years) {
            const yearExists = await Year.findById(yearId);
            if (!yearExists) {
                return res.status(400).json({ message: `Invalid year ID: ${yearId}` });
            }
        }
    }

    compatibility = await Compatibility.findByIdAndUpdate(
        req.params.id,
        { product, make, model, years },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Compatibility updated successfully",
        data: compatibility
    });
});

// @desc    Delete compatibility entry
// @route   DELETE /api/v1/compatibility/:id
// @access  Private (Admin)
exports.deleteCompatibility = asyncHandler(async (req, res, next) => {
    const compatibility = await Compatibility.findById(req.params.id);
    if (!compatibility) {
        return res.status(404).json({ message: "Compatibility entry not found" });
    }

    await compatibility.deleteOne();

    res.status(200).json({
        success: true,
        message: "Compatibility deleted successfully"
    });
});
