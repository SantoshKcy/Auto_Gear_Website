const express = require('express');
const router = express.Router();
const upload = require("../middleware/uploads");
const {
    createSticker,
    getStickers,
    updateSticker,
    deleteSticker
} = require('../controllers/stickerController');

// @route   POST /api/sticker
// @desc    Create a sticker (supports optional image upload)
router.post('/', upload.single('image'), createSticker);

// @route   GET /api/sticker
// @desc    Get all stickers
router.get('/', getStickers);

// @route   PUT /api/sticker/:id
// @desc    Update a sticker by ID (supports optional image upload)
router.put('/:id', upload.single('image'), updateSticker);

// @route   DELETE /api/sticker/:id
// @desc    Delete a sticker by ID
router.delete('/:id', deleteSticker);

module.exports = router;
