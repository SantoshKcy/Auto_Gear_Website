const express = require("express");
const router = express.Router();

const {
    createCustomizationSession,
    getSessionsByCustomer,
    getCustomizationSession,
    updateCustomizationSession
} = require("../controllers/customizationSessionController");

router.post("/", createCustomizationSession);
router.get("/customer/:customerId", getSessionsByCustomer);
router.get("/:id", getCustomizationSession);
router.put("/:id", updateCustomizationSession);

module.exports = router;
