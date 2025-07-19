import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        let temp = {};
        if (!formData.email.trim()) {
            temp.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            temp.email = 'Enter a valid email';
        }

        if (!formData.password) {
            temp.password = 'Password is required';
        }

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            const res = await axios.post(
                'http://localhost:3000/api/v1/auth/login',
                {
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                },
                { withCredentials: true }
            );

            const { token, userId, role } = res.data;

            login(token, userId, role);
            toast.success('Login successful!');

            setTimeout(() => {
                if (role === 'admin') {
                    window.location.href = '/admin/dashboard';
                } else {
                    navigate('/');
                }
            }, 1000);
        } catch (err) {
            const msg = err.response?.data?.message;
            if (msg === 'Please verify your email before logging in') {
                toast.error('Please verify your email before logging in');
            } else if (msg === 'Invalid credentials') {
                toast.error('Invalid email or password');
            } else {
                toast.error('Login failed. Try again.');
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
                        <h1 className="text-3xl font-semibold mb-6">Login</h1>

                        <form onSubmit={handleLogin} className='space-y-6'>
                            {/* Email */}
                            <div>
                                <label className="block text-[18px] mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full text-[18px] px-4 py-2 bg-[#1E1E1E] rounded-md focus:outline-none"
                                    placeholder="Enter your email"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[18px] mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full text-[18px] px-4 py-2 bg-[#1E1E1E] rounded-md focus:outline-none"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex justify-between items-center text-[16px] mt-2">
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" className="accent-[#FF4500]" />
                                    <span>Remember Me</span>
                                </label>
                                <a href="/forgot-password" className="text-white text-[16px] border-b border-white">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full mt-4 py-2 text-[18px] flex justify-center items-center gap-2 rounded-md transition ${loading ? 'bg-[#FF4500] cursor-not-allowed' : 'bg-[#FF4500] hover:bg-[#e63a00]'
                                    }`}
                            >
                                {loading && (
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
                                )}
                                {loading ? 'Logging in...' : 'Login'}
                            </button>

                        </form>

                        {/* Divider */}
                        {/* <div className="flex items-center space-x-2">
                            <div className="flex-grow h-px bg-gray-600" />
                            <span className="text-[16px] text-gray-400">or</span>
                            <div className="flex-grow h-px bg-gray-600" />
                        </div>

                        {/* Google Button */}
                        {/* <button className="w-full flex items-center text-[18px] justify-center space-x-3 py-2 border bg-white text-black rounded-md">
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            <span>Login with Google</span>
                        </button>  */}

                        {/* Sign up link */}
                        <p className="text-[16px] text-center mt-4">
                            Don’t have an account?{' '}
                            <a href="/register-step1" className="text-white border-b border-white">
                                Sign Up
                            </a>
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
