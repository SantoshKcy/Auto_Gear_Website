import axios from 'axios';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        setLoading(true);

        try {
            await axios.post('http://localhost:3000/api/v1/auth/forgot-password', {
                email: email.trim().toLowerCase(),
            });

            toast.success('Reset link sent to your email');
            setEmail('');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to send reset link';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex min-h-screen bg-black text-white font-rajdhani">
                {/* Left Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
                    <div className="w-full max-w-sm space-y-6">
                        <h1 className="text-3xl font-semibold mb-6">Forgot Password</h1>
                        <p className="text-gray-400 mb-4">
                            Enter your registered email address to receive a password reset link.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-[18px] mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full text-[18px] px-4 py-2 bg-[#1E1E1E] rounded-md focus:outline-none"
                                    placeholder="Enter your email"
                                />
                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full mt-4 py-2 text-[18px] flex justify-center items-center gap-2 rounded-md transition ${loading ? 'bg-[#FF4500] cursor-not-allowed' : 'bg-[#FF4500] hover:bg-[#e63a00]'
                                    }`}
                            >
                                {loading ? (
                                    <>
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
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>

                        {/* Back to Login */}
                        <p className="text-[16px] text-center mt-4">
                            Remember your password?{' '}
                            <Link to="/login" className="text-white border-b border-white">
                                Back to Login
                            </Link>
                        </p>
                    </div>

                    <p className="mt-10 text-sm text-gray-400">@2025 AutoGear</p>
                </div>

                {/* Right Side */}
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
                        src="src/assets/images/bg4.jpg"
                        alt="Car"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />
        </>
    );
}
