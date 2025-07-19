const CustomizationSession = require("../models/CustomizationSession");
const asyncHandler = require("../middleware/async");

// @desc Create new customization session
// @route POST /api/customization-sessions
exports.createCustomizationSession = asyncHandler(async (req, res) => {
    const {
        customerId,
        year,
        selectedExterior = [],
        selectedInterior = [],
        selectedPackages = [],
        selectedStickers = []
    } = req.body;

    const session = await CustomizationSession.create({
        customerId,
        year,
        selectedExterior,
        selectedInterior,
        selectedPackages,
        selectedStickers
    });

    res.status(201).json({
        success: true,
        data: session
    });
});

// @desc Get all sessions for a customer
// @route GET /api/customization-sessions/customer/:customerId
exports.getSessionsByCustomer = asyncHandler(async (req, res) => {
    const sessions = await CustomizationSession.find({ customerId: req.params.customerId })
        .populate('year')
        .populate('selectedExterior')
        .populate('selectedInterior')
        .populate('selectedPackages')
        .populate('selectedStickers');

    res.status(200).json({
        success: true,
        data: sessions
    });
});

// @desc Get a single session by ID
// @route GET /api/customization-sessions/:id
exports.getCustomizationSession = asyncHandler(async (req, res) => {
    const session = await CustomizationSession.findById(req.params.id)
        .populate('year')
        .populate('selectedExterior')
        .populate('selectedInterior')
        .populate('selectedPackages')
        .populate('selectedStickers');

    if (!session) {
        return res.status(404).json({ success: false, message: "Session not found" });
    }

    res.status(200).json({
        success: true,
        data: session
    });
});

// @desc Update a customization session
// @route PUT /api/customization-sessions/:id
exports.updateCustomizationSession = asyncHandler(async (req, res) => {
    const session = await CustomizationSession.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!session) {
        return res.status(404).json({ success: false, message: "Session not found" });
    }

    res.status(200).json({
        success: true,
        data: session
    });
});
