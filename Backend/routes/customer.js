// // routes/customer.js
// const express = require('express');
// const {
//     registerStep1,
//     registerStep2,
//     confirmEmail,
//     login,
//     getCustomer,
//     getCustomers,
//     updateCustomer,
//     deleteCustomer,
//     updatePassword,
//     uploadImage
// } = require('../controllers/customer');

// const { protect, authorize } = require("../middleware/auth");
// const upload = require("../middleware/uploads");

// const router = express.Router();

// // Registration flow
// router.post('/register-step1', registerStep1);
// router.post('/register-step2', registerStep2);
// router.get('/confirm-email/:token', confirmEmail);
// router.post('/login', login);

// // Customer profile management
// router.get('/', protect, authorize('admin'), getCustomers);
// router.get('/:id', protect, getCustomer);
// router.put('/:id', protect, updateCustomer);
// router.put('/update-password/:id', protect, updatePassword);
// router.delete('/:id', protect, authorize('admin'), deleteCustomer);

// // Upload profile image
// router.post("/uploadImage", protect, authorize("admin", "customer"), upload.single("profilePicture"), uploadImage);

// module.exports = router;
const express = require('express');
const {
    register,
    confirmEmail,
    login,
    getCustomer,
    getCustomers,
    updateCustomer,
    deleteCustomer,
    updatePassword,
    forgotPassword,
    resetPassword,
    uploadImage
} = require('../controllers/customer');

const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/uploads");

const router = express.Router();

// Registration flow
router.post('/register', upload.single("profilePicture"), register);
router.get('/confirm-email/:token', confirmEmail);
router.post('/login', login);

// Customer profile management
router.get('/getCustomers', getCustomers);
router.get('/:id', getCustomer);
router.put('/:id', protect, updateCustomer);
router.put("/updateCustomer/:id", protect, upload.single("profilePicture"), updateCustomer);
router.put('/updatePassword/:id', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.delete('/:id', protect, authorize('admin'), deleteCustomer);
router.post("/uploadImage", protect, authorize("admin", "customer"), upload.single("profilePicture"), uploadImage);

// Upload profile image
router.post(
    "/uploadImage",
    protect,
    authorize("admin", "customer"),
    upload.single("profilePicture"),
    uploadImage
);

module.exports = router;

// const { googleAuth } = require('../controllers/customer');

// router.post('/auth/google', googleAuth); 

