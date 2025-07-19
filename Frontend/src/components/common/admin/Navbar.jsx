import axios from "axios";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import defaultProfile from "/src/assets/images/profile.png";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [fname, setFname] = useState("User");
    const [profilePic, setProfilePic] = useState("");

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId || !token) return;

            try {
                const res = await axios.get(`http://localhost:3000/api/v1/auth/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const user = res.data?.data;
                setFname(user?.fname || "User");
                setProfilePic(user?.image || "");
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };

        fetchUser();
    }, [userId, token]);

    const handleDropdownClick = () => {
        setShowDropdown(false);
    };

    const handleLogout = () => {
        confirmAlert({
            title: "Confirm Logout",
            message: "Are you sure you want to logout?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        localStorage.clear();
                        window.location.href = "/login";
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    return (
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center bg-white shadow-md px-6 py-4 z-50">
            <div className="flex items-center gap-2">
                <Link to="/admin/dashboard" className="flex items-center gap-2">
                    <img src="/src/assets/images/black_logo.png" alt="Auto Gear" className="w-10 h-10" />
                    <span className="text-xl font-semibold text-[#FF4500]">Auto Gear</span>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2"
                    >
                        <span className="text-black text-[17px]">Hello, {fname}</span>
                        <img
                            src={profilePic ? `http://localhost:3000/uploads/${profilePic}` : defaultProfile}
                            alt="Profile"
                            className="w-8 h-8 rounded-full border"
                        />
                        <FaChevronDown className="text-black" />
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md">
                            <ul className="text-black">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <Link to="/admin/setting" onClick={handleDropdownClick}>
                                        Setting
                                    </Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 text-red-800 cursor-pointer" onClick={handleLogout}>
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
