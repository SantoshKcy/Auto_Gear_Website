import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Heart, ShoppingCart, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {Link} from "react-router-dom";
import logo from '../../../assets/images/no-bg-logo.png';



const Badge = ({ count }) => (
    <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
        {count}
    </div>
);

const Navbar = () => {
    const { user, logout } = useAuth();
    const isAuthenticated = !!user.token;
    const customerId = localStorage.getItem("userId");
    const navigate = useNavigate();
    const handleLogout = () => {
        confirmAlert({
            title: "Confirm Logout",
            message: "Are you sure you want to logout?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        localStorage.clear();
                        window.location.href = "/";
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileRef = useRef();

    const { data: wishlistData } = useQuery({
        queryKey: ["wishlistCount", customerId],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/wishlist/customer/${customerId}`);
            return res.data?.wishlist || [];
        },
        enabled: isAuthenticated,
    });

    const { data: cartData } = useQuery({
        queryKey: ["cartCount", customerId],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/cart/${customerId}`);
            return res.data?.products || [];
        },
        enabled: isAuthenticated,
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-[#101010]/90 border-b border-gray-700 text-white py-4 px-8 flex items-center justify-between sticky top-0 w-full z-1000 backdrop-blur-sm">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
    <img src={logo} className="h-12" alt="Auto Gear Logo" />

    <span className="text-xl font-bold">Auto Gear</span>
</Link>

            {/* Menu Links */}
            <ul className="hidden md:flex space-x-8 text-[18px]">
                {[
                    { label: "Home", to: "/" },
                    { label: "Shop", to: "/shop" },
                    { label: "Customize", to: "/customize" },
                    { label: "Services", to: "/services" },
                    { label: "About", to: "/about" },
                    { label: "Contact", to: "/contact" },
                ].map((item) => (
                    <li key={item.to}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `${isActive
                                    ? "text-white border-b-[3px] border-white"
                                    : "text-[#E0E0E0] border-b-[3px] border-transparent hover:text-white hover:border-white"
                                } transition-colors duration-200 pb-7`
                            }
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* Right Side */}
            <div className="flex items-center space-x-2 text-[18px] relative" ref={profileRef}>
                {isAuthenticated ? (
                    <>
                        <NavLink to="/wishlist" title="Wishlist" className="relative">
                            <div className="p-2 rounded-full hover:bg-[#FFFFFF1A] transition">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            {wishlistData?.length > 0 && <Badge count={wishlistData.length} />}
                        </NavLink>

                        <NavLink to="/cart" title="Cart" className="relative">
                            <div className="p-2 rounded-full hover:bg-[#FFFFFF1A] transition">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            {cartData?.length > 0 && <Badge count={cartData.length} />}
                        </NavLink>

                        {/* Profile Icon */}
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="p-2 rounded-full hover:bg-[#FFFFFF1A] transition relative"
                        >
                            <User className="w-6 h-6 text-white" />
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 top-14 w-52 bg-[#1E1E1E] border border-gray-700 rounded-md shadow-lg z-5">
                                <NavLink
                                    to="/profile"
                                    className="block px-4 py-3 text-[17px] hover:bg-[#2c2c2c] text-white"
                                    onClick={() => setShowProfileMenu(false)}
                                >
                                    My Account
                                </NavLink>
                                <NavLink
                                    to="/my-configuration"
                                    className="block px-4 py-3 text-[17px] hover:bg-[#2c2c2c] text-white"
                                    onClick={() => setShowProfileMenu(false)}
                                >
                                    My Configuration
                                </NavLink>
                                <NavLink
                                    to="/my-booking"
                                    className="block px-4 py-3 text-[17px] hover:bg-[#2c2c2c] text-white"
                                    onClick={() => setShowProfileMenu(false)}
                                >
                                    My Bookings
                                </NavLink>
                                <NavLink
                                    to="/my-orders"
                                    className="block px-4 py-3 text-[17px] hover:bg-[#2c2c2c] text-white"
                                    onClick={() => setShowProfileMenu(false)}
                                >
                                    My Orders
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-3 text-[17px] hover:bg-[#2c2c2c] text-red-400"
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <NavLink
                            to="/login"
                            className="bg-[#FFFFFF1A] text-white px-5 py-2 rounded-md flex items-center space-x-2"
                        >
                            <User className="w-6 h-6" />
                            <span>Login</span>
                        </NavLink>
                        <NavLink
                            to="/register-step1"
                            className="bg-[#FF4500] px-6 py-2 rounded-md text-white"
                        >
                            Sign Up
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
