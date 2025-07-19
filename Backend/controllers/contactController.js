const asyncHandler = require('../middleware/async');
const Contact = require('../models/Contact');

// @desc    Create a new contact message
// @route   POST /api/v1/contact
// @access  Public
exports.createContact = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, address, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !address || !message) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newContact = await Contact.create({
        firstName,
        lastName,
        email,
        phone,
        address,
        message
    });

    res.status(201).json({
        success: true,
        message: "Contact enquiry submitted successfully",
        data: newContact
    });
});
// @desc    Get all contacts
// @route   GET /api/v1/contact
// @access  Admin or Public (based on your app logic)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: error.message,
    });
  }
};
