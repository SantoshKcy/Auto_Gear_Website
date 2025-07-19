import { LogOut, Settings, CalendarCheck,Truck, Trash2,User } from "lucide-react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
    { label: "Account Setting", icon: <User size={18} />, path: "/profile" },
    { label: "My Configuration", icon: <Settings size={18} />, path: "/my-configuration" },
    { label: "My Booking", icon: <CalendarCheck size={18} />, path: "/my-booking" },
    { label: "My Orders", icon: <Truck size={18} />, path: "/my-orders" },
];

export default function SidebarNav() {
    const location = useLocation();
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

    const handleDeleteAccount = () => {
        confirmAlert({
            title: "Delete Account",
            message: "Are you sure you want to permanently delete your account?",
            buttons: [
                {
                    label: "Yes, Delete",
                    onClick: async () => {
                        try {
                            const userId = localStorage.getItem("userId");
                            const response = await fetch(`http://localhost:3000/api/v1/auth/${userId}`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            });

                            if (response.ok) {
                                alert("Account deleted successfully.");
                                localStorage.clear();
                                window.location.href = "/"; // or "/login"
                            } else {
                                alert("Failed to delete account.");
                            }
                        } catch (error) {
                            console.error("Error deleting account:", error);
                            alert("Something went wrong. Try again.");
                        }
                    },
                },
                {
                    label: "Cancel",
                },
            ],
        });
    };

    return (
        <div className="bg-[#1E1E1E] rounded p-4 w-full h-fit md:w-1/4 space-y-4">
            <h2 className="text-lg font-semibold mb-2">Profile</h2>
            <div className="space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`flex items-center space-x-2 w-full px-2 py-2 rounded text-[16px] ${
                            location.pathname === item.path
                                ? "text-white border-b border-[#FF4500]"
                                : "text-gray-300 hover:text-white hover:border-b hover:border-[#FF4500] "
                        }`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}

                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-2 py-2 text-[16px] text-red-400 "
                >
                    <LogOut size={18} />
                    <span>Log Out</span>
                </button>

                <button
                    onClick={handleDeleteAccount}
                    className="flex items-center space-x-2 w-full px-2 py-2 text-[16px] text-red-400"
                >
                    <Trash2 size={18} />
                    <span>Delete Account</span>
                </button>
            </div>
        </div>
    );
}
