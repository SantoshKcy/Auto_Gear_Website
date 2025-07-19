const express = require('express');
const router = express.Router();
const { createSupportRequest, getAllSupportRequests, getSupportRequest, deleteSupportRequest } = require('../controllers/support');

router.get('/', getAllSupportRequests);
router.get('/:id', getSupportRequest);
router.post('/', createSupportRequest);
router.delete('/:id', deleteSupportRequest);

module.exports = router;  // export the router instance, NOT an object
