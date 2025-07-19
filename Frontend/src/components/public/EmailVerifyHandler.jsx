import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export default function EmailVerifyHandler() {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await axios.get(`http://localhost:3000/api/v1/auth/confirm-email/${token}`);


                toast.success("Email verified successfully! Please log in.");
                setTimeout(() => navigate("/login"), 5000);
            } catch (err) {
                // toast.error(err.response?.data?.message || "Verification failed or token expired.");
                setTimeout(() => navigate("/login"), 3000);
            }
        };

        if (token) verifyEmail();
    }, [token, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white font-rajdhani">
            <p className="text-xl">Verifying your email, please wait...</p>
            <ToastContainer position="top-right" theme="dark" hideProgressBar />
        </div>
    );
}
