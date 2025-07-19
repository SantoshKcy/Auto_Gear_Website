import { CheckCircle } from 'lucide-react';
import Footer from '../common/customer/Footer';
import Navbar from '../common/customer/Navbar';

export default function BookingSuccessful() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#101010] flex items-center justify-center text-white font-rajdhani">
                <div className="bg-[#1E1E1E] px-10 py-8 rounded-2xl text-center w-[400px]">
                    <div className="flex justify-center mb-4">
                        <div className="bg-[#FF4500] rounded-full p-3">
                            <CheckCircle size={32} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-[18px] font-semibold mb-2">Booking Successful!</h2>
                    <p className="text-[16px] text-gray-300 mb-6">
                        Thank you for booking. Your booking has been placed successfully.
                    </p>
                    <button className="bg-[#FF4500] w-[110px] h-[40px] text-white py-2 px-6 rounded-md text-[18px] hover:opacity-90">
                        OK
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}
