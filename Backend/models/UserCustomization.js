const mongoose = require("mongoose");

const userCustomizationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      required: true,
    },
    year: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Year",
      required: true,
    },
    selectedOptions: [
      {
        option: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CustomizationOption",
          required: true,
        },
        colorCode: {
          type: String,
          default: null, // e.g., "#FF0000"
        },
      },
    ],
    image: {
      type: String, // Store base64-encoded image or file path
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    totalAmount: {
      type: Number,
      required: function () {
        return this.bookingStatus === "pending";
      },
      min: [0, "Total amount cannot be negative"],
    },
    shippingAddress: {
      name: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    paymentMethod: {
      type: String,
      enum: ["Stripe", "cod", null],
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    bookingStatus: {
      type: String,
      enum: ["saved", "pending", "confirmed", "cancelled"],
      default: "saved",
    },
    bookingDate: {
      type: Date, 
    },
    timeSlot: {
      type: String, 
      trim: true,
      
    },
    isShared: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserCustomization", userCustomizationSchema);