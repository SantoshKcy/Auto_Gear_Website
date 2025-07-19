const CustomizationOption = require("../models/CustomizationOption");
const asyncHandler = require("../middleware/async");

// @desc    Create a new customization option
// @route   POST /api/v1/customization-option
// @access  Admin
exports.createCustomizationOption = asyncHandler(async (req, res) => {
    const { title, type, price, colorCode } = req.body;

    const image = req.files?.image?.[0]?.filename || null;
    const asset = req.files?.asset?.[0]?.filename || null;

    const customization = await CustomizationOption.create({
        title,
        type,
        price,
        image,
        colorCode,
        asset,
    });

    res.status(201).json({
        success: true,
        message: "Customization option created successfully",
        data: customization,
    });
});


// @desc    Get all customization options
// @route   GET /api/v1/customization-option
// @access  Public
exports.getCustomizationOptions = asyncHandler(async (req, res) => {
    const options = await CustomizationOption.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: options.length,
        data: options,
    });
});

// @desc    Get customization options by type
// @route   GET /api/v1/customization-option/type/:type
// @access  Public
exports.getOptionsByType = asyncHandler(async (req, res) => {
    const { type } = req.params;

    const options = await CustomizationOption.find({ type });

    res.status(200).json({
        success: true,
        data: options,
    });
});

// @desc    Delete a customization option
// @route   DELETE /api/v1/customization-option/:id
// @access  Admin
exports.deleteCustomizationOption = asyncHandler(async (req, res) => {
    const option = await CustomizationOption.findById(req.params.id);

    if (!option) {
        res.status(404);
        throw new Error("Customization option not found");
    }

    await option.remove();

    res.status(200).json({
        success: true,
        message: "Customization option deleted",
    });
});
