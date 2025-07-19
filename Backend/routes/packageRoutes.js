const express = require('express');
const router = express.Router();
const {
    createPackage,
    getAllPackages,
    getPackageById,
    updatePackage,
    deletePackage,
} = require('../controllers/packageController'); const upload = require("../middleware/uploads");

// POST - Create a new package
router.post('/', upload.single('image'), createPackage);

// GET - Get all packages
router.get('/', getAllPackages);

// GET - Get single package by ID
router.get('/:id', getPackageById);

// PUT - Update package by ID
router.put('/:id', upload.single('image'), updatePackage);

// DELETE - Delete package by ID
router.delete('/:id', deletePackage);

module.exports = router;
