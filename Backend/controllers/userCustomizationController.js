const asyncHandler = require("../middleware/async");
const UserCustomization = require("../models/UserCustomization");

// @desc    Create a new customization (saved or booked)
// @route   POST /api/v1/customization
const defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="; // 1x1 transparent pixel

exports.createCustomization = asyncHandler(async (req, res) => {
  const {
    customerId,
    model,
    year,
    selectedOptions,
    notes,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    isPaid,
    bookingStatus,
    isShared,
    bookingDate,
    timeSlot,
    totalAmount,
    image,
  } = req.body;

  console.log('Received customization creation payload:', req.body);

  // Basic validation
  if (!customerId || !model || !year || !selectedOptions || selectedOptions.length === 0) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate bookingStatus
  const validStatuses = ["saved", "pending", "confirmed", "cancelled"];
  if (bookingStatus && !validStatuses.includes(bookingStatus)) {
    return res.status(400).json({ message: "Invalid booking status" });
  }

  // If it's a booking, validate extra fields
  if (bookingStatus === "pending") {
    if (!paymentMethod || !["Stripe", "cod"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid or missing payment method" });
    }
    const existingBooking = await UserCustomization.findOne({
      bookingDate: new Date(bookingDate),
      timeSlot: timeSlot,
      bookingStatus: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked. Please choose a different time.",
      });
    }

    const requiredFields = ["name", "email", "phone", "street", "city", "state", "postalCode"];
    const missing = requiredFields.filter((field) => !shippingAddress?.[field]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing shipping fields: ${missing.join(", ")}` });
    }

    if (!bookingDate || !timeSlot) {
      return res.status(400).json({ message: "Booking date and time slot are required for booking." });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Total amount is required and must be greater than 0 for booking." });
    }

    // Validate paymentStatus
    const validPaymentStatuses = ["Pending", "Paid", "Failed"];
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }
  }

  const customization = await UserCustomization.create({
    customerId,
    model,
    year,
    selectedOptions,
    image: bookingStatus === "pending" ? (image || defaultImage) : (image || null), // Use default image for pending if none provided
    notes,
    totalAmount: bookingStatus === "pending" ? totalAmount : undefined,
    shippingAddress: bookingStatus === "pending" ? shippingAddress : undefined,
    paymentMethod: bookingStatus === "pending" ? paymentMethod : undefined,
    paymentStatus: bookingStatus === "pending" ? paymentStatus || "Pending" : undefined,
    isPaid: bookingStatus === "pending" ? isPaid !== undefined ? isPaid : false : undefined,
    bookingStatus: bookingStatus || "saved",
    isShared: isShared || false,
    bookingDate: bookingStatus === "pending" ? bookingDate : undefined,
    timeSlot: bookingStatus === "pending" ? timeSlot : undefined,
  });

  console.log('Customization created successfully:', customization);

  res.status(201).json({
    success: true,
    message: bookingStatus === "pending" ? "Customization booked successfully" : "Customization saved successfully",
    data: customization,
  });
});

// @desc    Get customization by ID
// @route   GET /api/v1/customization/:id
exports.getCustomizationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const customization = await UserCustomization.findById(id)
    .populate("model", "name")
    .populate("year", "year")
    .populate("selectedOptions.option", "title price colorCode");

  if (!customization) {
    return res.status(404).json({ message: "Customization not found" });
  }

  res.status(200).json({
    success: true,
    data: customization,
  });
});

// @desc    Get all customizations by customer
// @route   GET /api/v1/customization/customer/:customerId
exports.getCustomizationsByCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const customizations = await UserCustomization.find({ customerId })
    .populate("model", "name")
    .populate("year", "year")
    .populate("selectedOptions.option", "title price colorCode")
    .select("-__v")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: customizations.length,
    data: customizations,
  });
});

// @desc    Get all customizations (bookings) for admin
// @route   GET /api/v1/customization
exports.getAllCustomizations = asyncHandler(async (req, res) => {
  const customizations = await UserCustomization.find()
    .populate("customerId", "fname lname email")
    .populate("model", "name")
    .populate("year", "year")
    .populate("selectedOptions.option", "title price colorCode")
    .select("-__v")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: customizations.length,
    data: customizations,
  });
});

// @desc    Update customization booking status
// @route   PUT /api/v1/customization/:id
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const {
    bookingStatus,
    paymentMethod,
    paymentStatus,
    isPaid,
    bookingDate,
    timeSlot,
    shippingAddress,
    image,
  } = req.body;

  const customization = await UserCustomization.findById(req.params.id);
  if (!customization) {
    return res.status(400).json({ success: false, message: "Customization not found" });
  }

  if (bookingStatus) {
    const validStatuses = ["saved", "pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(bookingStatus)) {
      return res.status(400).json({ success: false, message: "Invalid booking status" });
    }
    customization.bookingStatus = bookingStatus;
  }

  if (paymentMethod) {
    const validMethods = ["Stripe", "cod", null];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    }
    customization.paymentMethod = paymentMethod;
  }

  if (paymentStatus) {
    const validPaymentStatuses = ["Pending", "Paid", "Failed"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: "Invalid payment status" });
    }
    customization.paymentStatus = paymentStatus;
  }

  if (isPaid !== undefined) {
    customization.isPaid = isPaid;
  }

  if (bookingDate) {
    customization.bookingDate = bookingDate;
  }

  if (timeSlot) {
    customization.timeSlot = timeSlot;
  }

  if (shippingAddress && typeof shippingAddress === "object") {
    customization.shippingAddress = {
      ...customization.shippingAddress?.toObject(),
      ...shippingAddress,
    };
  }

  if (image) {
    customization.image = image;
  }

  await customization.save();

  res.status(200).json({
    success: true,
    message: "Customization updated successfully",
    data: customization,
  });
});

// @desc    Delete a customization by ID
// @route   DELETE /api/v1/customization/:id
// @access  Private (based on your auth middleware)
exports.deleteCustomization = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const customization = await UserCustomization.findById(id);
  if (!customization) {
    return res.status(404).json({
      success: false,
      message: "Customization not found",
    });
  }

  await customization.deleteOne();

  res.status(200).json({
    success: true,
    message: "Customization deleted successfully",
  });
});
