const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", // should match your product model name
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1,
            },
            selectedVariant: {
                material: {
                    type: String,
                    
                },
                color: {
                    type: String,
                 
                },
                dimensions: {
                    type: String,
                    
                }
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema);
