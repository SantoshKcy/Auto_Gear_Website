const express = require("express");
const {
  createCustomization,
  getCustomizationById,
  getCustomizationsByCustomer,
  getAllCustomizations,
  updateBookingStatus,
  deleteCustomization,
} = require("../controllers/userCustomizationController");

const router = express.Router();

// Order matters: more specific routes must come first
router.get("/", getAllCustomizations);
router.post("/", createCustomization);
router.get("/customer/:customerId", getCustomizationsByCustomer);
router.get("/:id", getCustomizationById);
router.put("/:id", updateBookingStatus);  // <-- update route
router.delete("/:id", deleteCustomization);

module.exports = router;
