const mongoose = require('mongoose');

const carModelSchema = new mongoose.Schema({
    make: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Make',
        required: true,
    },
    model: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Model',
        required: true,
    },
    years: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Year',
            required: true,
        }
    ],
    vehicleImage: {
        type: String, // URL or file path
    },
    customizerAsset: {
        type: String, // URL or file path to 3D model (.glb/.fbx)
    },
    categoryWiseProducts: [
        {
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
                required: true,
            },
            subcategories: [
                {
                    subcategory: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Subcategory',
                        required: true,
                    },
                    products: [
                        {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'Product',
                        }
                    ],
                }
            ],
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('CarModel', carModelSchema);
