const Sticker = require("../models/sticker");
const asyncHandler = require("../middleware/async");

// @desc    Create a new sticker
// @route   POST /api/sticker
exports.createSticker = asyncHandler(async (req, res) => {
  const {
    type,
    text,
    fontFamily,
    fontSize,
    fontColor,
    position,
    rotation,
    scale,
    layerIndex,
    opacity,
  } = req.body;

  // Handle uploaded image if type is upload or predefined
  let image = req.body.image || null;
  if ((type === "upload" || type === "predefined") && req.file) {
    image = req.file.filename; // Assuming multer is used
  }

  const sticker = await Sticker.create({
    type,
    image,
    text,
    fontFamily,
    fontSize,
    fontColor,
    position,
    rotation,
    scale,
    layerIndex,
    opacity,
  });

  res.status(201).json({
    success: true,
    message: "Sticker created successfully",
    data: sticker,
  });
});

// @desc    Get all stickers
// @route   GET /api/sticker
exports.getStickers = asyncHandler(async (req, res) => {
  const query = {};

  // Optional filtering (e.g., by year or model in future)
  if (req.query.year) {
    query.year = req.query.year;
  }

  const stickers = await Sticker.find(query).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: stickers,
  });
});

// @desc    Update a sticker
// @route   PUT /api/sticker/:id
exports.updateSticker = asyncHandler(async (req, res) => {
  const sticker = await Sticker.findById(req.params.id);

  if (!sticker) {
    res.status(404);
    throw new Error("Sticker not found");
  }

  const updatedData = req.body;

  if (
    (updatedData.type === "predefined" || updatedData.type === "upload") &&
    req.file
  ) {
    updatedData.image = req.file.filename;
  }

  const updatedSticker = await Sticker.findByIdAndUpdate(
    req.params.id,
    updatedData,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: "Sticker updated successfully",
    data: updatedSticker,
  });
});

// @desc    Delete a sticker
// @route   DELETE /api/sticker/:id
exports.deleteSticker = asyncHandler(async (req, res) => {
  const sticker = await Sticker.findById(req.params.id);

  if (!sticker) {
    res.status(404);
    throw new Error("Sticker not found");
  }

  await sticker.deleteOne();

  res.json({
    success: true,
    message: "Sticker deleted successfully",
  });
});
