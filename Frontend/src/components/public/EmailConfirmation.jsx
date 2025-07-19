import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function EmailConfirmation() {
    const location = useLocation();
    const { email } = location.state || {};


    return (
        <>
            <div className="flex min-h-screen bg-black text-white font-rajdhani">
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
                    <div className="max-w-md space-y-6">
                        <div className="space-y-2">
                            <p className="text-[16px] text-gray-400">Step 3 of 3</p>
                            <h1 className="text-3xl font-semibold">Verify Your Email</h1>
                        </div>

                        <p className="text-[16px] text-gray-300 leading-relaxed">
                            We sent an email to <span className="text-white text-lg font-medium">{email || "your email"}</span>.<br />
                            Just click on the link to complete your signup.
                        </p>

                        <p className="text-[16px] text-gray-300">
                            Still can't find the email? Check your spam folder or wait a few minutes.
                        </p>

                        <p className="text-[16px]">
                            Need help?{" "}
                            <a href="#" className="border-b border-white">
                                Contact Us
                            </a>
                        </p>
                    </div>

                    <p className="mt-10 text-sm text-gray-400">@2025 AutoGear</p>
                </div>

                <div className="hidden md:block md:w-1/2 relative">
                    <div className="absolute top-5 right-5 flex items-center space-x-2 z-10">
                        <img
                            src="/src/assets/images/no-bg-logo.png"
                            alt="Logo"
                            className="w-12 h-12 object-contain"
                        />
                        <span className="text-white text-xl font-semibold tracking-wide">
                            Auto Gear
                        </span>
                    </div>

                    <img
                        src="/src/assets/images/bg4.jpg"
                        alt="Car"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <ToastContainer position="top-right" theme="dark" autoClose={3000} hideProgressBar />
        </>
    );
}
