const asyncHandler = require("../middleware/async");
const Product = require("../models/product");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Brand = require("../models/brand");
const mongoose = require("mongoose");
const Compatibility = require("../models/compatibility");

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find()
        .populate("category", "name")
        .populate("subcategory", "name")
        .populate("brand", "name");

    res.status(200).json({
        success: true,
        count: products.length,
        data: products,
    });
});

// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(id)
        .populate("category", "name")
        .populate("subcategory", "name")
        .populate("brand", "name")
        .populate({
            path: "compatibilities",
            model: "Compatibility",
            populate: [
                { path: "make", select: "name" },
                { path: "model", select: "name" },
                { path: "years", select: "year" }
            ]
        });

    if (!product) {
        return res.status(404).json({ message: `Product not found with id of ${id}` });
    }
    product.views = (product.views || 0) + 1;
    await product.save(); // Save updated view count

    res.status(200).json({
        success: true,
        data: product,
    });
});

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private (Admin)
exports.createProduct = asyncHandler(async (req, res, next) => {
    const {
        name,
        description,
        category,
        subcategory,
        brand,
        price,
        warranty,
        quantity, // ✅ 1. Extract quantity
        materials,
        colors,
        dimensions,
        tags,
    } = req.body;

    // Validate IDs
    const [existingCategory, existingSubcategory, existingBrand] = await Promise.all([
        Category.findById(category),
        Subcategory.findById(subcategory),
        Brand.findById(brand),
    ]);

    if (!existingCategory) return res.status(400).json({ message: "Invalid category ID" });
    if (!existingSubcategory) return res.status(400).json({ message: "Invalid subcategory ID" });
    if (!existingBrand) return res.status(400).json({ message: "Invalid brand ID" });

    // Handle uploaded files
    const images = req.files ? req.files.map(file => file.filename) : [];

    // Parse variants
    const parsedMaterials = typeof materials === "string" ? JSON.parse(materials) : materials || [];
    const parsedColors = typeof colors === "string" ? JSON.parse(colors) : colors || [];
    let parsedDimensions = typeof dimensions === "string" ? JSON.parse(dimensions) : dimensions || [];

    // Filter dimensions format like "10x20x30"
    parsedDimensions = parsedDimensions.filter(dim =>
        typeof dim === 'string' && dim.trim().match(/^\d+(\.\d+)?x\d+(\.\d+)?x\d+(\.\d+)?$/)
    );

    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags || [];

    // ✅ 2. Create the product with quantity
    const product = await Product.create({
        name,
        description,
        category,
        subcategory,
        brand,
        price,
        warranty,
        quantity: Number(quantity) || 0, // fallback to 0 if empty/undefined
        image: images,
        tags: parsedTags,
        variants: {
            materials: parsedMaterials,
            colors: parsedColors,
            dimensions: parsedDimensions
        }
    });

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });
});


// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private (Admin)
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID format" });
    }

    let product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: `Product not found with id of ${id}` });
    }

    const {
        name,
        description,
        category,
        subcategory,
        brand,
        variants,
        price,
        warranty,
        media,
        tags,
    } = req.body;

    // Validate referenced IDs if provided
    if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) return res.status(400).json({ message: "Category not found" });
    }
    if (subcategory) {
        const subcategoryExists = await Subcategory.findById(subcategory);
        if (!subcategoryExists) return res.status(400).json({ message: "Subcategory not found" });
    }
    if (brand) {
        const brandExists = await Brand.findById(brand);
        if (!brandExists) return res.status(400).json({ message: "Brand not found" });
    }

    product = await Product.findByIdAndUpdate(
        id,
        {
            name,
            description,
            category,
            subcategory,
            brand,
            variants,
            price,
            warranty,
            media,
            tags,
        },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
    });
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private (Admin)
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: `Product not found with id of ${id}` });
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});

exports.getItemsByTag = asyncHandler(async (req, res, next) => {
  const { tag } = req.query;
  const allowedTags = ["Featured", "Best Seller", "Trending"];

  if (!tag) {
    return res.status(400).json({ success: false, message: "Tag is required" });
  }
  if (!allowedTags.includes(tag)) {
    return res.status(400).json({ success: false, message: `Invalid tag. Allowed: ${allowedTags.join(", ")}` });
  }

  console.log("Searching products with tag:", tag);

  const products = await Product.find({ tags: tag }) // filter by tag in array
    .populate("category", "name")
    .populate("subcategory", "name")
    .populate("brand", "name")
    .lean();

  console.log(`Found ${products.length} products with tag "${tag}":`, products.map(p => p.name));

  return res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});




// @desc    Get most viewed products
// @route   GET /api/v1/products/most-viewed
// @access  Public
exports.getMostViewedProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find()
        .sort({ views: -1 }) // sort descending by views
        .limit(4); // top 4

    res.status(200).json({
        success: true,
        count: products.length,
        data: products,
    });
});

// Query params: make, model, year, categories (array), brands (array), sort (string)
exports.getFilteredProducts = async (req, res) => {
  try {
    let {
      make,
      model,
      year,
      categories,
      brands,
      sort,
      search, 
    } = req.query;

    // Parse array params if sent as comma separated strings
    if (categories && typeof categories === 'string') {
      categories = categories.split(',');
    }
    if (brands && typeof brands === 'string') {
      brands = brands.split(',');
    }

    // Step 1: Build product filter for category, brand
    const productFilter = {};

    if (categories && categories.length > 0) {
      productFilter.category = { $in: categories };
    }
    if (brands && brands.length > 0) {
      productFilter.brand = { $in: brands };
    }
     if (search && typeof search === 'string') {
      productFilter.name = { $regex: search, $options: 'i' }; // Case-insensitive regex search
    }

    // Step 2: If any of make/model/year filters exist, filter products via Compatibility collection
    if (make || model || year) {
      // Build compatibility query
      const compatibilityFilter = {};
      if (make) compatibilityFilter.make = make;
      if (model) compatibilityFilter.model = model;
      if (year) compatibilityFilter.years = year; // year is ObjectId here

      // Find all matching compatibilities
      const matchingCompatibilities = await Compatibility.find(compatibilityFilter).select('product').lean();

      // Extract product IDs from compatibilities
      const productIds = matchingCompatibilities.map(c => c.product.toString());

      // If no products match compatibility filters, respond with empty
      if (productIds.length === 0) {
        return res.json({ success: true, count: 0, products: [] });
      }

      // Filter products by these IDs plus any category/brand filters
      productFilter._id = { $in: productIds };
    }

    // Step 3: Build sort object
    let sortOption = {};
    if (sort === 'price-asc') {
      sortOption.price = 1;
    } else if (sort === 'price-desc') {
      sortOption.price = -1;
    }

    // Step 4: Query products with filters and populate refs as needed
    const products = await Product.find(productFilter)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('brand', 'name')
      .sort(sortOption)
      .lean();

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};