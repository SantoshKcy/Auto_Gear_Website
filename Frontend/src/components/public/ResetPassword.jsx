import axios from 'axios';
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoImg from '../../assets/images/no-bg-logo.png';
import bgImg from '../../assets/images/bg4.jpg';


export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    let temp = {};
    if (!formData.password) temp.password = 'New password is required';
    else if (formData.password.length < 6) temp.password = 'Password must be at least 6 characters';
    if (formData.confirmPassword !== formData.password) {
      temp.confirmPassword = 'Passwords do not match';
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/auth/reset-password/${token}`,
        { password: formData.password },
        { withCredentials: true }
      );

      toast.success(res.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-black text-white font-rajdhani">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
          <div className="w-full max-w-sm space-y-6">
            <h1 className="text-3xl font-semibold mb-6">Reset Password</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label className="block text-[18px] mb-1">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full text-[18px] px-4 py-2 bg-[#1E1E1E] rounded-md focus:outline-none"
                  placeholder="Enter new password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[18px] mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full text-[18px] px-4 py-2 bg-[#1E1E1E] rounded-md focus:outline-none"
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-4 py-2 text-[18px] flex justify-center items-center gap-2 rounded-md transition ${loading ? 'bg-[#FF4500] cursor-not-allowed' : 'bg-[#FF4500] hover:bg-[#e63a00]'}`}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-4">
              Remembered your password?{' '}
              <Link to="/login" className="border-b border-white text-white">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden md:block md:w-1/2 relative">
          <div className="absolute top-5 right-5 flex items-center space-x-2 z-10">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logoImg} alt="Logo" className="w-12 h-12 object-contain" />
              <span className="text-white text-xl font-semibold tracking-wide">Auto Gear</span>
            </Link>
          </div>
          <img src={bgImg} alt="Car" className="w-full h-full object-cover" />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />
    </>
  );
}
