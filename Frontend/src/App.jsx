// import { lazy, Suspense } from "react";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import ScrollToTop from "./components/common/customer/ScrollToTop";
// import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth

// // Lazy Imports
// const Home = lazy(() => import("./components/public/Home"));
// const Login = lazy(() => import("./components/public/Login"));
// const Register = lazy(() => import("./components/public/Register"));
// const Register2 = lazy(() => import("./components/public/Register2"));
// const EmailConfirmation = lazy(() => import("./components/public/EmailConfirmation"));
// const CarSearch = lazy(() => import("./components/public/CarSearch"));
// const ExteriorCustomization = lazy(() => import("./components/public/ExteriorCustomization"));
// const InteriorCustomization = lazy(() => import("./components/public/InteriorCustomization"));
// const Packages = lazy(() => import("./components/public/Packages"));
// const Stickers = lazy(() => import("./components/public/Stickers"));
// const Summary = lazy(() => import("./components/public/Summary"));
// const Booking = lazy(() => import("./components/public/Booking"));
// const Payment = lazy(() => import("./components/public/Payment"));
// const BookingSuccessful = lazy(() => import("./components/public/BookingSuccessful"));
// const Gallery = lazy(() => import("./components/public/Gallery"));
// const Services = lazy(() => import("./components/public/Services"));
// const Faq = lazy(() => import("./components/public/Faq"));
// const About = lazy(() => import("./components/public/About"));
// const Contact = lazy(() => import("./components/public/Contact"));
// const Profile = lazy(() => import("./components/public/Profile"));
// const MyConfiguration = lazy(() => import("./components/public/Myconfiguration"));
// const Shop = lazy(() => import("./components/public/Shop"));
// const ProductDetail = lazy(() => import("./components/public/ProductDetail"));
// const Wishlist = lazy(() => import("./components/public/Wishlist"));
// const Cart = lazy(() => import("./components/public/Cart"));
// const Checkout1 = lazy(() => import("./components/public/Checkout1"));
// const Layout = lazy(() => import("./components/private"));
// const Dashboard = lazy(() => import("./components/private/dashboard"));







// function App() {

//     // Wrapping the routes setup logic with useAuth
//     const { user, loading } = useAuth(); // Use the custom hook to access auth context

//     if (loading) return <div>Loading...</div>; // Show loading while checking auth

//     const publicRoutes = [
//         { path: "/", element: <Suspense><Home /></Suspense>, errorElement: <>Error</> },
//         { path: "/login", element: <Suspense><Login /></Suspense>, errorElement: <>Error</> },
//         { path: "/register-step1", element: <Suspense><Register /></Suspense>, errorElement: <>Error</> },
//         { path: "/register-step2", element: <Suspense><Register2 /></Suspense>, errorElement: <>Error</> },
//         { path: "/email-confirmation", element: <Suspense><EmailConfirmation /></Suspense>, errorElement: <>Error</> },
//         { path: "/car-search", element: <Suspense><CarSearch /></Suspense>, errorElement: <>Error</> },
//         { path: "/exterior-customization", element: <Suspense><ExteriorCustomization /></Suspense>, errorElement: <>Error</> },
//         { path: "/interior-customization", element: <Suspense><InteriorCustomization /></Suspense>, errorElement: <>Error</> },
//         { path: "/packages", element: <Suspense><Packages /></Suspense>, errorElement: <>Error</> },
//         { path: "/stickers", element: <Suspense><Stickers /></Suspense>, errorElement: <>Error</> },
//         { path: "/summary", element: <Suspense><Summary /></Suspense>, errorElement: <>Error</> },
//         { path: "/booking", element: <Suspense><Booking /></Suspense>, errorElement: <>Error</> },
//         { path: "/payment", element: <Suspense><Payment /></Suspense>, errorElement: <>Error</> },
//         { path: "/booking-successful", element: <Suspense><BookingSuccessful /></Suspense>, errorElement: <>Error</> },
//         { path: "/gallery", element: <Suspense><Gallery /></Suspense>, errorElement: <>Error</> },
//         { path: "/services", element: <Suspense><Services /></Suspense>, errorElement: <>Error</> },
//         { path: "/faq", element: <Suspense><Faq /></Suspense>, errorElement: <>Error</> },
//         { path: "/about-us", element: <Suspense><About /></Suspense>, errorElement: <>Error</> },
//         { path: "/contact-us", element: <Suspense><Contact /></Suspense>, errorElement: <>Error</> },
//         { path: "/profile", element: <Suspense><Profile /></Suspense>, errorElement: <>Error</> },
//         { path: "/my-configuration", element: <Suspense><MyConfiguration /></Suspense>, errorElement: <>Error</> },
//         { path: "/shop", element: <Suspense><Shop /></Suspense>, errorElement: <>Error</> },
//         { path: "/product-detail", element: <Suspense><ProductDetail /></Suspense>, errorElement: <>Error</> },
//         { path: "/wishlist", element: <Suspense><Wishlist /></Suspense>, errorElement: <>Error</> },
//         { path: "/cart", element: <Suspense><Cart /></Suspense>, errorElement: <>Error</> },
//         { path: "/checkout", element: <Suspense><Checkout1 /></Suspense>, errorElement: <>Error</> },

//         { path: "*", element: <div>404: Page not found</div> },
//     ];

//     const privateRoutes = [
//         {
//             path: "/admin",
//             element: <Suspense><Layout /></Suspense>,
//             errorElement: <>Error</>,
//             children: [
//                 { path: "dashboard", element: <Suspense><Dashboard /></Suspense>, errorElement: <>Error</> },
//                 // { path: "category/edit-category/:id", element: <Suspense><EditCategory /></Suspense>, errorElement: <>Error</> },
//                 // { path: "subcategory/edit-subcategory/:id", element: <Suspense><EditSubcategory /></Suspense>, errorElement: <>Error</> },
//                 // { path: "menu/edit-item/:id", element: <Suspense><EditItem /></Suspense>, errorElement: <>Error</> },
//                 // { path: "category/all-categories", element: <Suspense><AllCategory /></Suspense>, errorElement: <>Error</> },
//                 // { path: "category/add-category", element: <Suspense><AddCategory /></Suspense>, errorElement: <>Error</> },
//                 // { path: "subcategory/add-subcategory", element: <Suspense><AddSubcategory /></Suspense>, errorElement: <>Error</> },
//                 // { path: "subcategory/all-subcategories", element: <Suspense><AllSubcategory /></Suspense>, errorElement: <>Error</> },
//                 // { path: "support", element: <Suspense><Support /></Suspense>, errorElement: <>Error</> },
//                 // { path: "users", element: <Suspense><User /></Suspense>, errorElement: <>Error</> },
//                 // { path: "menu/all-items", element: <Suspense><ViewItem /></Suspense>, errorElement: <>Error</> },
//                 // { path: "menu/add-item", element: <Suspense><AddItem /></Suspense>, errorElement: <>Error</> },
//                 // { path: "order/all-orders", element: <Suspense><AllOrder /></Suspense>, errorElement: <>Error</> },
//                 // { path: "order/pending-orders", element: <Suspense><PendingOrder /></Suspense>, errorElement: <>Error</> },
//                 // { path: "order/confirmed-orders", element: <Suspense><ConfirmOrder /></Suspense>, errorElement: <>Error</> },
//                 // { path: "order/processing-orders", element: <Suspense><ProcessingOrder /></Suspense>, errorElement: <>Error</> },
//                 // { path: "order/completed-orders", element: <Suspense><CompletedOrder /></Suspense>, errorElement: <>Error</> },
//                 // { path: "order/cancelled-orders", element: <Suspense><CancelOrder /></Suspense>, errorElement: <>Error</> },
//                 // // { path: "reviews", element: <Suspense><Review /></Suspense>, errorElement: <>Error</> },
//                 // { path: "setting", element: <Suspense><Settings /></Suspense>, errorElement: <>Error</> },
//             ],
//         },
//         { path: "*", element: <>Page snot found</>, errorElement: <>Error</> },
//     ];

//     const isAdmin = user?.role === "admin"; // Check if the user is an admin
//     const routes = isAdmin ? privateRoutes : publicRoutes;

//     return (
//         <AuthProvider>
//             <div>
//                 <RouterProvider router={createBrowserRouter(routes)} />
//                 <ScrollToTop />  {/* Include ScrollToTop Component */}
//             </div>
//         </AuthProvider>
//     );
// }

// export default App;

import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ScrollToTop from "./components/common/customer/ScrollToTop";
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth


// Lazy Imports
const Home = lazy(() => import("./components/public/Home"));
const Login = lazy(() => import("./components/public/Login"));
const Register = lazy(() => import("./components/public/Register"));
const Register2 = lazy(() => import("./components/public/Register2"));
const EmailConfirmation = lazy(() => import("./components/public/EmailConfirmation"));
const CarSearch = lazy(() => import("./components/public/CarSearch"));
const Customization = lazy(() => import("./components/public/customization.jsx"));
const InteriorCustomization = lazy(() => import("./components/public/InteriorCustomization"));
const Packages = lazy(() => import("./components/public/Packages"));
const Stickers = lazy(() => import("./components/public/Stickers"));
const Summary = lazy(() => import("./components/public/Summary"));
const Booking = lazy(() => import("./components/public/Booking"));
const Payment = lazy(() => import("./components/public/Payment"));
const BookingSuccessful = lazy(() => import("./components/public/BookingSuccessful"));
const Gallery = lazy(() => import("./components/public/Gallery"));
const Services = lazy(() => import("./components/public/Services"));
const Faq = lazy(() => import("./components/public/Faq"));
const PrivacyPolicy = lazy(() => import("./components/public/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./components/public/TermsConditions"));
const About = lazy(() => import("./components/public/About"));
const MyOrders = lazy(() => import("./components/public/MyOrders"));
const Contact = lazy(() => import("./components/public/Contact"));
const Profile = lazy(() => import("./components/public/Profile"));
const MyConfigurations = lazy(() => import("./components/public/Myconfigurations"));
const Shop = lazy(() => import("./components/public/Shop"));
const Wishlist = lazy(() => import("./components/public/Wishlist"));
const Cart = lazy(() => import("./components/public/Cart"));
const Checkout1 = lazy(() => import("./components/public/Checkout1"));
const Layout = lazy(() => import("./components/private"));
const Dashboard = lazy(() => import("./components/private/dashboard"));
const AddCategory = lazy(() => import("./components/private/category/Form"));
const EditCategory = lazy(() => import("./components/private/category/EditCategory"));
const EditProduct = lazy(() => import("./components/private/product/EditProduct"));
const EditSubcategory = lazy(() => import("./components/private/subcategory/EditSubcategory"));
const AllCategory = lazy(() => import("./components/private/category"));
const AllSubcategory = lazy(() => import("./components/private/subcategory"));
const AddSubcategory = lazy(() => import("./components/private/subcategory/Form"));
const AllBrand = lazy(() => import("./components/private/brand"));
const AddBrand = lazy(() => import("./components/private/brand/Form"));
const EditBrand = lazy(() => import("./components/private/brand/EditBrand"));
const ManageCompatibility = lazy(() => import("./components/private/compatibility"));
const AddProduct = lazy(() => import("./components/private/product/Form"));
const AllProducts = lazy(() => import("./components/private/product"));
const AllOrders = lazy(() => import("./components/private/order"));
const AllBooking = lazy(() => import("./components/private/booking/Booking"));
const AllCarModels = lazy(() => import("./components/private/model"));
const AddCarModel = lazy(() => import("./components/private/model/Form"));
const Support = lazy(() => import("./components/private/user/Support"));
const Settings = lazy(() => import("./components/private/user/Form"));
const User = lazy(() => import("./components/private/user"));
const EmailVerifyHandler = lazy(() => import("./components/public/EmailVerifyHandler"));
const ProductDetails = lazy(() => import("./components/public/ProductDetails"));
const ModificationBooking = lazy(() => import("./components/public/ModificationBooking"));
const MyBooking = lazy(() => import("./components/public/MyBooking"));
const ForgotPassword = lazy(() => import("./components/public/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/public/ResetPassword"));


function App() {
    const { user, loading } = useAuth(); // Use the custom hook to access auth context

    if (loading) return <div>Loading...</div>; // Show loading while checking auth
    const isAdmin = user?.role === "admin"; // Check if the user is an admin

    // Define public and private routes
    const publicRoutes = [
        { path: "/", element: <Suspense><Home /></Suspense> },
        { path: "/login", element: <Suspense><Login /></Suspense> },
        { path: "/register-step1", element: <Suspense><Register /></Suspense> },
        { path: "/register-step2", element: <Suspense><Register2 /></Suspense> },
        { path: "/email-confirmation", element: <Suspense><EmailConfirmation /></Suspense> },
        { path: "/customize", element: <Suspense><CarSearch /></Suspense> },
        { path: "/customization", element: <Suspense><Customization /></Suspense> },
        { path: "/interior-customization", element: <Suspense><InteriorCustomization /></Suspense> },
        { path: "/packages", element: <Suspense><Packages /></Suspense> },
        { path: "/stickers", element: <Suspense><Stickers /></Suspense> },
        { path: "/summary", element: <Suspense><Summary /></Suspense> },
        { path: "/booking", element: <Suspense><Booking /></Suspense> },
        { path: "/payment", element: <Suspense><Payment /></Suspense> },
        { path: "/booking-successful", element: <Suspense><BookingSuccessful /></Suspense> },
        { path: "/gallery", element: <Suspense><Gallery /></Suspense> },
        { path: "/services", element: <Suspense><Services /></Suspense> },
        { path: "/faq", element: <Suspense><Faq /></Suspense> },
        { path: "/terms-and-conditions", element: <Suspense><TermsConditions /></Suspense> },
        { path: "/privacy-policy", element: <Suspense><PrivacyPolicy /></Suspense> },
        { path: "/about", element: <Suspense><About /></Suspense> },
        { path: "/contact", element: <Suspense><Contact /></Suspense> },
        { path: "/profile", element: <Suspense><Profile /></Suspense> },
        { path: "/my-configuration", element: <Suspense><MyConfigurations /></Suspense> },
        { path: "/shop", element: <Suspense><Shop /></Suspense> },
        { path: "/product/:id", element: <Suspense><ProductDetails /></Suspense> },
        { path: "/wishlist", element: <Suspense><Wishlist /></Suspense> },
        { path: "/cart", element: <Suspense><Cart /></Suspense> },
        { path: "/confirm-email/:token", element: <Suspense><EmailVerifyHandler /></Suspense> },
        { path: "/checkout", element: <Suspense><Checkout1 /></Suspense> },
        { path: "/forgot-password", element: <Suspense><ForgotPassword /></Suspense> },
        { path: "/my-orders", element: <Suspense><MyOrders /></Suspense> },
        { path: "/my-booking", element: <Suspense><MyBooking /></Suspense> },
        { path:"/reset-password/:token" ,element: <Suspense><ResetPassword /></Suspense> },

        { path: "/modification-booking", element: <Suspense><ModificationBooking /></Suspense> },
        { path: "*", element: <div>404: Page not found</div> },
    ];

    const privateRoutes = [
        {
            path: "/admin",
            element: <Suspense><Layout /></Suspense>,
            children: [
                { path: "dashboard", element: <Suspense><Dashboard /></Suspense> },
                { path: "category/add-category", element: <Suspense><AddCategory /></Suspense> },
                { path: "category/all-categories", element: <Suspense><AllCategory /></Suspense> },
                { path: "category/edit-category/:id", element: <Suspense><EditCategory /></Suspense>, errorElement: <>Error</> },
                { path: "product/edit-product/:id", element: <Suspense><EditProduct /></Suspense>, errorElement: <>Error</> },
                { path: "brand/edit-brand/:id", element: <Suspense><EditBrand /></Suspense>, errorElement: <>Error</> },
                { path: "subcategory/edit-subcategory/:id", element: <Suspense><EditSubcategory /></Suspense>, errorElement: <>Error</> },
                { path: "subcategory/all-subcategories", element: <Suspense><AllSubcategory /></Suspense> },
                { path: "subcategory/add-subcategory", element: <Suspense><AddSubcategory /></Suspense> },
                { path: "brand/all-brands", element: <Suspense><AllBrand /></Suspense> },
                { path: "brand/add-brand", element: <Suspense><AddBrand /></Suspense> },
                { path: "product/add-product", element: <Suspense><AddProduct /></Suspense> },
                { path: "product/all-products", element: <Suspense><AllProducts /></Suspense> },
                { path: "total-orders", element: <Suspense><AllOrders /></Suspense> },
                { path: "all-booking", element: <Suspense><AllBooking /></Suspense> },
                { path: "model/all-models", element: <Suspense><AllCarModels /></Suspense> },
                { path: "manage-compatibility", element: <Suspense><ManageCompatibility /></Suspense> },
                { path: "model/add-model", element: <Suspense><AddCarModel /></Suspense> },
                { path: "support", element: <Suspense><Support /></Suspense>, errorElement: <>Error</> },
                { path: "users", element: <Suspense><User /></Suspense>, errorElement: <>Error</> },
                { path: "setting", element: <Suspense><Settings /></Suspense>, errorElement: <>Error</> },
            ],
        },
        { path: "*", element: <div>404: Page not found</div> },
    ];

    const routes = isAdmin ? privateRoutes : publicRoutes;

    return (
        <AuthProvider>
            <div>
                <RouterProvider router={createBrowserRouter(routes)} />
                <ScrollToTop />  {/* Include ScrollToTop Component */}
            </div>
        </AuthProvider>
    );



}

export default App;

