const asyncHandler = require("../middleware/async");
const Make = require("../models/make");
const mongoose = require("mongoose");

// @desc    Get all makes
// @route   GET /api/v1/makes
// @access  Public
exports.getMakes = asyncHandler(async (req, res, next) => {
    const makes = await Make.find();
    res.status(200).json({
        success: true,
        count: makes.length,
        data: makes,
    });
});

// @desc    Get single make by ID
// @route   GET /api/v1/makes/:id
// @access  Public
exports.getMake = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid make ID format" });
    }

    const make = await Make.findById(id);
    if (!make) {
        return res.status(404).json({ message: `Make not found with id of ${id}` });
    }

    res.status(200).json({
        success: true,
        data: make,
    });
});

// @desc    Create new make
// @route   POST /api/v1/makes
// @access  Private (Admin)
exports.createMake = asyncHandler(async (req, res, next) => {
    const { name } = req.body;

    // Check for duplicate make
    const existingMake = await Make.findOne({ name });
    if (existingMake) {
        return res.status(400).json({ message: "Make with this name already exists" });
    }

    const make = await Make.create({ name });

    res.status(201).json({
        success: true,
        message: "Make created successfully",
        data: make,
    });
});

// @desc    Update make
// @route   PUT /api/v1/makes/:id
// @access  Private (Admin)
exports.updateMake = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid make ID format" });
    }

    let make = await Make.findById(id);
    if (!make) {
        return res.status(404).json({ message: `Make not found with id of ${id}` });
    }

    const { name } = req.body;

    make = await Make.findByIdAndUpdate(
        id,
        { name },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Make updated successfully",
        data: make,
    });
});

// @desc    Delete make
// @route   DELETE /api/v1/makes/:id
// @access  Private (Admin)
exports.deleteMake = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid make ID format" });
    }

    const make = await Make.findById(id);
    if (!make) {
        return res.status(404).json({ message: `Make not found with id of ${id}` });
    }

    await make.deleteOne();

    res.status(200).json({
        success: true,
        message: "Make deleted successfully",
    });
});
