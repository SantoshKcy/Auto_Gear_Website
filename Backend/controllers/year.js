const asyncHandler = require("../middleware/async");
const Year = require("../models/year");
const Model = require("../models/model");
const mongoose = require("mongoose");

// @desc    Get all years
// @route   GET /api/v1/years
// @access  Public
exports.getYears = asyncHandler(async (req, res, next) => {
    const years = await Year.find().populate("model", "name");
    res.status(200).json({
        success: true,
        count: years.length,
        data: years,
    });
});

// @desc    Get single year by ID
// @route   GET /api/v1/years/:id
// @access  Public
exports.getYear = asyncHandler(async (req, res, next) => {
    const year = await Year.findById(req.params.id).populate("model", "name");
    if (!year) {
        return res.status(404).json({ message: `Year not found with id of ${req.params.id}` });
    }
    res.status(200).json({
        success: true,
        data: year,
    });
});

// @desc    Create new year
// @route   POST /api/v1/years
// @access  Private (Admin)
exports.createYear = asyncHandler(async (req, res, next) => {
    const { year, modelId } = req.body;

    const existingModel = await Model.findById(modelId);
    if (!existingModel) {
        return res.status(400).json({ message: "Model not found" });
    }

    const existingYear = await Year.findOne({ year, model: modelId });
    if (existingYear) {
        return res.status(400).json({ message: "Year already exists for this model" });
    }

    const customizerAsset = req.files?.customizerAsset?.[0]?.filename || "";
    const vehicleImage = req.files?.vehicleImage?.[0]?.filename || "";

    const newYear = await Year.create({
        year,
        model: modelId,
        customizerAsset,
        vehicleImage
    });

    res.status(201).json({
        success: true,
        message: "Year created with 3D asset and image",
        data: newYear,
    });
});


// @desc    Update year
// @route   PUT /api/v1/years/:id
// @access  Private (Admin)
exports.updateYear = asyncHandler(async (req, res, next) => {
    const yearId = req.params.id;

    const yearDoc = await Year.findById(yearId);
    if (!yearDoc) {
        return res.status(404).json({ message: 'Year not found' });
    }

    const updatedData = {};

    // Handle file uploads
    if (req.files?.customizerAsset?.[0]) {
        updatedData.customizerAsset = req.files.customizerAsset[0].filename;
    }
    if (req.files?.vehicleImage?.[0]) {
        updatedData.vehicleImage = req.files.vehicleImage[0].filename;
    }

    // Handle option references (convert comma-separated strings or arrays)
    if (req.body.exteriorOptions) {
        updatedData.exteriorOptions = Array.isArray(req.body.exteriorOptions)
            ? req.body.exteriorOptions
            : JSON.parse(req.body.exteriorOptions);
    }

    if (req.body.interiorOptions) {
        updatedData.interiorOptions = Array.isArray(req.body.interiorOptions)
            ? req.body.interiorOptions
            : JSON.parse(req.body.interiorOptions);
    }

    if (req.body.packages) {
        updatedData.packages = Array.isArray(req.body.packages)
            ? req.body.packages
            : JSON.parse(req.body.packages);
    }

    if (req.body.stickers) {
        updatedData.stickers = Array.isArray(req.body.stickers)
            ? req.body.stickers
            : JSON.parse(req.body.stickers);
    }

    // Perform the update
    const updatedYear = await Year.findByIdAndUpdate(yearId, updatedData, { new: true });

    res.status(200).json({
        success: true,
        message: 'Year updated successfully',
        data: updatedYear,
    });
});

// @desc    Delete year
// @route   DELETE /api/v1/years/:id
// @access  Private (Admin)
exports.deleteYear = asyncHandler(async (req, res, next) => {
    const yearEntry = await Year.findById(req.params.id);
    if (!yearEntry) {
        return res.status(404).json({ message: `Year not found with id of ${req.params.id}` });
    }

    await yearEntry.deleteOne();

    res.status(200).json({
        success: true,
        message: "Year deleted successfully",
    });
});
// @desc    Get years by model ID
// @route   GET /api/v1/year/getYearsByModel/:modelId
// @access  Public
exports.getYearsByModel = asyncHandler(async (req, res, next) => {
    const { modelId } = req.params;

    const years = await Year.find({ model: modelId }).sort({ year: -1 });

    res.status(200).json({
        success: true,
        count: years.length,
        data: years,
    });
});
exports.getPackagesByYear = asyncHandler(async (req, res, next) => {
  const { yearId } = req.params;

  const year = await Year.findById(yearId).populate('packages');
  if (!year) {
    return res.status(404).json({ success: false, message: "Year not found" });
  }

  res.status(200).json({
    success: true,
    count: year.packages.length,
    data: year.packages,
  });
});

// @desc    Get stickers by year ID
// @route   GET /api/v1/year/getStickersByYear/:yearId
// @access  Public
exports.getStickersByYear = asyncHandler(async (req, res, next) => {
  const { yearId } = req.params;

  const year = await Year.findById(yearId).populate('stickers');
  if (!year) {
    return res.status(404).json({ success: false, message: "Year not found" });
  }

  res.status(200).json({
    success: true,
    count: year.stickers.length,
    data: year.stickers,
  });
});


