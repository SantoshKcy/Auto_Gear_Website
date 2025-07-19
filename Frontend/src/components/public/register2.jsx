import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate,Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateAccountStep2() {
    const location = useLocation();
    const navigate = useNavigate();

    const { fname, lname } = location.state || {};

    if (!fname || !lname) {
        navigate("/register-step1");
    }

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be 10 digits.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter.";
        } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one special character.";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required.";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const payload = {
                fname,
                lname,
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone,
                password: formData.password,
            };

            const response = await axios.post(
                "http://localhost:3000/api/v1/auth/register",
                payload,
                { headers: { "Content-Type": "application/json" } }
            );

            toast.success(response.data.message || "Account created successfully!");
            setTimeout(() => navigate("/email-confirmation", {
                state: { email: formData.email.trim().toLowerCase() }
            }), 2000);

        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex min-h-screen bg-black text-white font-rajdhani">
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
                    <div className="w-full max-w-sm space-y-6">
                        <div className="space-y-2">
                            <p className="text-[16px] text-gray-400">Step 2 of 3</p>
                            <h1 className="text-3xl font-semibold">Create Account</h1>
                        </div>

                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            <div>
                                <label className="block text-[18px] mb-">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full text-[18px] px-4 py-2 bg-[#1E1E1E] rounded-md focus:outline-none"
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[18px] mb-1">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full text-[18px] px-4 py-2 bg-[#1E1E1E] rounded-md focus:outline-none"
                                    placeholder="Enter your phone number"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[18px] mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full text-[18px] px-4 py-2 bg-[#1E1E1E] rounded-md focus:outline-none"
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[18px] mb-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full text-[18px] px-4 py-2 bg-[#1E1E1E] rounded-md focus:outline-none"
                                        placeholder="Re-enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        tabIndex={-1}
                                    >
                                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <p className="text-sm text-gray-300 leading-relaxed mt-2 mb-4">
                                By clicking ‘Create Account’, I authorize AutoGear to contact me with
                                more information about AutoGear and services via the contact
                                information I provide.
                            </p>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 text-[18px] rounded-md transition ${loading
                                    ? "bg-[#FF4500] cursor-not-allowed"
                                    : "bg-[#FF4500] hover:bg-[#e63a00]"
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex justify-center items-center space-x-2">
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                        <span>Loading...</span>
                                    </div>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="mt-10 text-sm text-gray-400">@2025 AutoGear</p>
                </div>

                <div className="hidden md:block md:w-1/2 relative">
                    <div className="absolute top-5 right-5 flex items-center space-x-2 z-10">
                        <Link to="/" className="flex items-center space-x-2">
    <img
      src="src/assets/images/no-bg-logo.png"
      alt="Logo"
      className="w-12 h-12 object-contain"
    />
    <span className="text-white text-xl font-semibold tracking-wide">
      Auto Gear
    </span>
  </Link>
                    </div>

                    <img
                        src="/src/assets/images/bg4.jpg"
                        alt="Car"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />
        </>
    );
}
