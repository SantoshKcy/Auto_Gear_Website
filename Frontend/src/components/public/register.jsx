import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";

export default function CreateAccount() {
    const navigate = useNavigate();

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [errors, setErrors] = useState({ fname: "", lname: "" });
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        let valid = true;
        const newErrors = { fname: "", lname: "" };

        if (!fname.trim()) {
            newErrors.fname = "Please enter first name.";
            valid = false;
        }

        if (!lname.trim()) {
            newErrors.lname = "Please enter last name.";
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            setLoading(true);
            setTimeout(() => {
                navigate("/register-step2", { state: { fname, lname } });
            }, 1000);
        }
    };

    return (
        <div className="flex min-h-screen bg-black text-white font-rajdhani">
            {/* Left Side - Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
                <div className="w-full max-w-sm space-y-6">
                    <div className="space-y-2">
                        <p className="text-[16px] text-gray-400">Step 1 of 3</p>
                        <h1 className="text-3xl font-semibold">Create Account</h1>
                    </div>

                    {/* First Name */}
                    <div>
                        <label className="block text-[18px] mb-1">First Name</label>
                        <input
                            type="text"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                            className="w-full text-[18px] px-4 py-2 bg-[#1E1E1E] rounded-md focus:outline-none"
                            placeholder="Enter your first name"
                        />
                        {errors.fname && (
                            <p className="text-red-500 text-sm mt-1">{errors.fname}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-[18px] mb-1">Last Name</label>
                        <input
                            type="text"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                            className="w-full text-[18px] px-4 py-2 bg-[#1E1E1E] rounded-md focus:outline-none"
                            placeholder="Enter your last name"
                        />
                        {errors.lname && (
                            <p className="text-red-500 text-sm mt-1">{errors.lname}</p>
                        )}
                    </div>

                    {/* Consent Text */}
                    <p className="text-[16px] text-gray-300 leading-relaxed">
                        By clicking ‘Next’, I understand and agree to AutoGear’s Privacy
                        Policy and Terms & Conditions for creating an account and I
                        authorize to contact me for account management purposes via the
                        contact information I provide.
                    </p>

                    {/* Next Button with Loading */}
                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className={`w-full py-2 text-[18px] text-center rounded-md transition block ${loading
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
                            "Next"
                        )}
                    </button>
                </div>

                <p className="mt-10 text-sm text-gray-400">@2025 AutoGear</p>
            </div>

            {/* Right Side - Image with Logo */}
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
    );
}
