const asyncHandler = require("../middleware/async");
const Support = require("../models/support");

// @desc    Get all support requests
// @route   GET /api/v1/support
// @access  Private (Admin)
exports.getAllSupportRequests = asyncHandler(async (req, res, next) => {
    const supports = await Support.find();
    res.status(200).json({
        success: true,
        count: supports.length,
        data: supports,
    });
});

// @desc    Get single support request by ID
// @route   GET /api/v1/support/:id
// @access  Private (Admin)
exports.getSupportRequest = asyncHandler(async (req, res, next) => {
    const support = await Support.findById(req.params.id);
    if (!support) {
        return res.status(404).json({ message: `Support request not found with id of ${req.params.id}` });
    }
    res.status(200).json({
        success: true,
        data: support,
    });
});

// @desc    Create new support request
// @route   POST /api/v1/support
// @access  Public
exports.createSupportRequest = asyncHandler(async (req, res, next) => {
    const { firstname, lastname, email, currentaddress, phone, message } = req.body;

    // You can add validation here if needed

    const support = await Support.create({
        firstname,
        lastname,
        email,
        currentaddress,
        phone,
        message,
    });

    res.status(201).json({
        success: true,
        message: "Support request created successfully",
        data: support,
    });
});

// @desc    Delete support request
// @route   DELETE /api/v1/support/:id
// @access  Private (Admin)
exports.deleteSupportRequest = asyncHandler(async (req, res, next) => {
    const support = await Support.findById(req.params.id);
    if (!support) {
        return res.status(404).json({ message: `Support request not found with id of ${req.params.id}` });
    }

    await support.deleteOne();

    res.status(200).json({
        success: true,
        message: "Support request deleted successfully",
    });
});
