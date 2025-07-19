const asyncHandler = require("../middleware/async");
const Order = require("../models/order");

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private (Customer)
exports.createOrder = asyncHandler(async (req, res) => {
    const {
        customerId,
        products,
        totalAmount,
        paymentMethod,
        shippingAddress,
        paymentStatus,
        isPaid,
        notes,
    } = req.body;

    console.log('Received order creation payload:', req.body); // Log payload for debugging

    // Validate required fields
    if (!customerId || !products || !totalAmount || !paymentMethod || !shippingAddress) {
        console.error('Missing required fields:', { customerId, products, totalAmount, paymentMethod, shippingAddress });
        return res.status(400).json({
            success: false,
            message: 'Missing required fields',
        });
    }

    try {
        const order = await Order.create({
            customerId,
            products,
            totalAmount,
            paymentMethod,
            shippingAddress,
            paymentStatus: paymentStatus || 'Pending', // Respect provided paymentStatus or default
            isPaid: isPaid !== undefined ? isPaid : false, // Respect provided isPaid or default
            orderStatus: paymentStatus === 'Paid' ? 'Processing' : 'Pending', // Set orderStatus based on paymentStatus
            notes,
        });

        console.log('Order created successfully:', order);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    } catch (error) {
        console.error('Order creation failed:', error.message, error.stack);
        res.status(500).json({
            success: false,
            message: `Failed to create order: ${error.message}`,
        });
    }
});

// @desc    Get a single order by ID
// @route   GET /api/v1/orders/:id
// @access  Private (Customer/Admin)
exports.getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("customerId", "name email")
        .populate("products.productId", "name price image");

    if (!order) {
        return res.status(404).json({
            success: false,
            message: `Order not found with id ${req.params.id}`,
        });
    }

    res.status(200).json({
        success: true,
        data: order,
    });
});

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders
// @access  Private (Admin)
exports.getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .populate("customerId", "fname lname email")
        .populate("products.productId", "name price image")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
    });
});

// @desc    Get all orders by customer ID
// @route   GET /api/v1/orders/customer/:customerId
// @access  Private (Customer)
exports.getOrdersByCustomer = asyncHandler(async (req, res) => {
    const orders = await Order.find({ customerId: req.params.customerId })
        .populate("products.productId", "name price image")
        .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No orders found for this customer",
        });
    }

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
    });
});

// @desc    Update order status (Admin)
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderStatus, paymentStatus, deliveryDate, isPaid } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (deliveryDate) order.deliveryDate = deliveryDate;
    if (typeof isPaid === "boolean") order.isPaid = isPaid;

    await order.save();

    res.status(200).json({
        success: true,
        message: "Order updated successfully",
        data: order,
    });
});

// @desc    Delete order (Admin)
// @route   DELETE /api/v1/orders/:id
// @access  Private (Admin)
exports.deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found",
        });
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    });
});