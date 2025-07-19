const asyncHandler = require("../middleware/async");
const CarModel = require("../models/CarModel");
const Make = require("../models/make");
const Model = require("../models/model");
const Year = require("../models/year");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const mongoose = require("mongoose");

// @desc    Get all car models
// @route   GET /api/v1/carmodels
// @access  Public
exports.getCarModels = asyncHandler(async (req, res, next) => {
    const carModels = await CarModel.find()
        .populate("make", "name")
        .populate("model", "name")
        .populate("years", "year")
        .populate({
            path: "categoryWiseProducts.category",
            select: "name",
        })
        .populate({
            path: "categoryWiseProducts.subcategories.subcategory",
            select: "name",
        })
        .populate({
            path: "categoryWiseProducts.subcategories.products",
            select: "name price",
        });

    res.status(200).json({
        success: true,
        count: carModels.length,
        data: carModels,
    });
});

// @desc    Get single car model by ID
// @route   GET /api/v1/carmodels/:id
// @access  Public
exports.getCarModel = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid CarModel ID format" });
    }

    const carModel = await CarModel.findById(id)
        .populate("make", "name")
        .populate("model", "name")
        .populate("years", "year")
        .populate({
            path: "categoryWiseProducts.category",
            select: "name",
        })
        .populate({
            path: "categoryWiseProducts.subcategories.subcategory",
            select: "name",
        })
        .populate({
            path: "categoryWiseProducts.subcategories.products",
            select: "name price",
        });

    if (!carModel) {
        return res.status(404).json({ message: `CarModel not found with id of ${id}` });
    }

    res.status(200).json({
        success: true,
        data: carModel,
    });
});

// @desc    Create new car model
// @route   POST /api/v1/carmodels
// @access  Private (Admin)
exports.createCarModel = asyncHandler(async (req, res, next) => {
    const {
        make,
        model,
        years,
        vehicleImage,
        customizerAsset,
        categoryWiseProducts,
    } = req.body;

    // Validate referenced entities exist
    const existingMake = await Make.findById(make);
    if (!existingMake) return res.status(400).json({ message: "Make not found" });

    const existingModel = await Model.findById(model);
    if (!existingModel) return res.status(400).json({ message: "Model not found" });

    // Validate years array contains valid year IDs
    if (!Array.isArray(years) || years.length === 0) {
        return res.status(400).json({ message: "Years field must be a non-empty array" });
    }

    for (const yearId of years) {
        if (!mongoose.Types.ObjectId.isValid(yearId)) {
            return res.status(400).json({ message: `Invalid year ID: ${yearId}` });
        }
        const yearExists = await Year.findById(yearId);
        if (!yearExists) {
            return res.status(400).json({ message: `Year not found: ${yearId}` });
        }
    }

    // Optional: Validate categoryWiseProducts structure deeply if needed

    const newCarModel = await CarModel.create({
        make,
        model,
        years,
        vehicleImage,
        customizerAsset,
        categoryWiseProducts,
    });

    res.status(201).json({
        success: true,
        message: "Car model created successfully",
        data: newCarModel,
    });
});

// @desc    Update car model
// @route   PUT /api/v1/carmodels/:id
// @access  Private (Admin)
exports.updateCarModel = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const {
        make,
        model,
        years,
        vehicleImage,
        customizerAsset,
        categoryWiseProducts,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid CarModel ID format" });
    }

    const carModel = await CarModel.findById(id);
    if (!carModel) {
        return res.status(404).json({ message: `CarModel not found with id of ${id}` });
    }

    // Validate referenced entities (similar to create)
    if (make) {
        const existingMake = await Make.findById(make);
        if (!existingMake) return res.status(400).json({ message: "Make not found" });
    }

    if (model) {
        const existingModel = await Model.findById(model);
        if (!existingModel) return res.status(400).json({ message: "Model not found" });
    }

    if (years) {
        if (!Array.isArray(years) || years.length === 0) {
            return res.status(400).json({ message: "Years field must be a non-empty array" });
        }
        for (const yearId of years) {
            if (!mongoose.Types.ObjectId.isValid(yearId)) {
                return res.status(400).json({ message: `Invalid year ID: ${yearId}` });
            }
            const yearExists = await Year.findById(yearId);
            if (!yearExists) {
                return res.status(400).json({ message: `Year not found: ${yearId}` });
            }
        }
    }

    const updatedCarModel = await CarModel.findByIdAndUpdate(
        id,
        {
            make,
            model,
            years,
            vehicleImage,
            customizerAsset,
            categoryWiseProducts,
        },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Car model updated successfully",
        data: updatedCarModel,
    });
});

// @desc    Delete car model
// @route   DELETE /api/v1/carmodels/:id
// @access  Private (Admin)
exports.deleteCarModel = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid CarModel ID format" });
    }

    const carModel = await CarModel.findById(id);
    if (!carModel) {
        return res.status(404).json({ message: `CarModel not found with id of ${id}` });
    }

    await carModel.deleteOne();

    res.status(200).json({
        success: true,
        message: "Car model deleted successfully",
    });
});
