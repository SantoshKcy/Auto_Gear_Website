const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
    createModel,
    getModels,
    getModel,
    updateModel,
    deleteModel,
    getModelsByMake
} = require("../controllers/model");

// Routes for model
router.post("/createModel", createModel);
router.get("/getModels", getModels);
router.get("/getModel/:id", getModel);
router.put("/updateModel/:id", protect, updateModel);
router.delete("/deleteModel/:id", protect, deleteModel);
router.get('/by-make/:makeId', getModelsByMake);


module.exports = router;
