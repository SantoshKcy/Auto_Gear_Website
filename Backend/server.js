require('dotenv').config({ path: './config/config.env' });
const path = require("path");
const express = require("express");

const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();





app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // allow sending cookies
}));
// // Load env file
// dotenv.config({
//     path: "./config/config.env",
// });

// Connect to database
connectDB();
require('./utils/cleanup');
// Route files
const auth = require("./routes/customer");
const category = require("./routes/category");
const subcategory = require("./routes/subcategory");
const brand = require("./routes/brand");
const make = require("./routes/make");
const model = require("./routes/model");
const year = require("./routes/year");
const compatibility = require("./routes/compatibility");
const CarModel = require("./routes/CarModel");
const product = require("./routes/product");
const cart = require("./routes/cart");
const wishlist = require("./routes/wishlist");
const support = require("./routes/support");
const order = require("./routes/orderRoutes");
const customization = require("./routes/customizationOptionRoutes");
const package = require("./routes/packageRoutes");
const sticker = require("./routes/stickerRoutes");
const customizationsession = require("./routes/customizationSessionRoutes");
const contact = require("./routes/Contact");
const stripeRoutes = require("./routes/stripe"); 


const usercustomization = require("./routes/userCustomizationRoutes");





app.use("/api/v1/stripe/webhook", express.raw({ type: "application/json" }), stripeRoutes);
// Body parser
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));


// app.use(express.static('public'));

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/category", category);
app.use("/api/v1/subcategory", subcategory);
app.use("/api/v1/brand", brand);
app.use("/api/v1/make", make);
app.use("/api/v1/model", model);
app.use("/api/v1/year", year);
app.use("/api/v1/compatibility", compatibility);
app.use("/api/v1/carmodel", CarModel);
app.use("/api/v1/product", product);
app.use("/api/v1/cart", cart);
app.use("/api/v1/wishlist", wishlist);
app.use("/api/v1/support", support);
app.use("/api/v1/order", order);
app.use("/api/v1/customization-option", customization);
app.use("/api/v1/package", package);
app.use("/api/v1/sticker", sticker);
app.use("/api/v1/customization-session", customizationsession);
app.use("/api/v1/contact", contact);
app.use("/api/v1/customization", usercustomization);
app.use("/api/v1/stripe", stripeRoutes); 




//routes





const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = app;  // Export the app object

