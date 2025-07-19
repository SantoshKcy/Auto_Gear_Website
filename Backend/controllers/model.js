const asyncHandler = require("../middleware/async");
const Model = require("../models/model");
const Make = require("../models/make");
const mongoose = require("mongoose");

// @desc    Get all models
// @route   GET /api/v1/models
// @access  Public
exports.getModels = asyncHandler(async (req, res, next) => {
    const models = await Model.find().populate("make", "name");
    res.status(200).json({
        success: true,
        count: models.length,
        data: models,
    });
});

// @desc    Get single model by ID
// @route   GET /api/v1/models/:id
// @access  Public
exports.getModel = asyncHandler(async (req, res, next) => {
    const model = await Model.findById(req.params.id).populate("make", "name");
    if (!model) {
        return res.status(404).json({ message: `Model not found with id of ${req.params.id}` });
    }
    res.status(200).json({
        success: true,
        data: model,
    });
});

// @desc    Create new model
// @route   POST /api/v1/models
// @access  Private (Admin)
exports.createModel = asyncHandler(async (req, res, next) => {
    const { name, makeId } = req.body;

    const existingMake = await Make.findById(makeId);
    if (!existingMake) {
        return res.status(400).json({ message: "Make not found" });
    }

    const existingModel = await Model.findOne({ name, make: makeId });
    if (existingModel) {
        return res.status(400).json({ message: "Model already exists under this make" });
    }

    const model = await Model.create({ name, make: makeId });

    res.status(201).json({
        success: true,
        message: "Model created successfully",
        data: model,
    });
});

// @desc    Update model
// @route   PUT /api/v1/models/:id
// @access  Private (Admin)
exports.updateModel = asyncHandler(async (req, res, next) => {
    let model = await Model.findById(req.params.id);
    if (!model) {
        return res.status(404).json({ message: `Model not found with id of ${req.params.id}` });
    }

    const { name, make } = req.body;

    if (make) {
        const existingMake = await Make.findById(make);
        if (!existingMake) {
            return res.status(400).json({ message: "Make not found" });
        }
    }

    model = await Model.findByIdAndUpdate(
        req.params.id,
        { name, make },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Model updated successfully",
        data: model,
    });
});

// @desc    Delete model
// @route   DELETE /api/v1/models/:id
// @access  Private (Admin)
exports.deleteModel = asyncHandler(async (req, res, next) => {
    const model = await Model.findById(req.params.id);
    if (!model) {
        return res.status(404).json({ message: `Model not found with id of ${req.params.id}` });
    }

    await model.deleteOne();

    res.status(200).json({
        success: true,
        message: "Model deleted successfully",
    });
});// @desc    Get models by make ID
// @route   GET /api/v1/models/by-make/:makeId
// @access  Public
exports.getModelsByMake = asyncHandler(async (req, res, next) => {
    const { makeId } = req.params;

    const models = await Model.find({ make: makeId }).populate("make", "name");

    res.status(200).json({
        success: true,
        count: models.length,
        data: models,
    });
});



