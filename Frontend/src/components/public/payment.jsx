import Footer from '../common/customer/Footer';
import Navbar from "../common/customer/Navbar";

export default function Booking() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#101010] text-white font-rajdhani p-6">
                <h2 className="text-center text-lg font-semibold">Book Your Appointment</h2>
                <p className="text-center text-sm text-gray-300 mb-8">
                    Schedule a time for our experts to implement your customizations
                </p>

                <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {/* Left Section - Payment Method */}
                    <div className="bg-[#1E1E1E] p-6 rounded">
                        <h3 className="text-[18px] font-semibold mb-2">Select Payment Method</h3>
                        <p className="text-[16px] text-gray-300 mb-4">Choose your preferred payment method</p>

                        <div className="space-y-4 mb-6">
                            {['Khalti', 'Esewa', 'COD'].map((method, index) => (
                                <label key={index} className="flex items-center space-x-3 cursor-pointer">
                                    <input type="radio" name="payment" className="accent-[#FF4500]" />
                                    <span className="text-[16px]">{method}</span>
                                </label>
                            ))}
                        </div>

                        <button className="bg-[#FF4500] w-full py-2 rounded text-[14px] font-semibold hover:opacity-90">
                            Confirm Booking
                        </button>
                    </div>

                    {/* Right Section - Order Summary */}
                    <div className="bg-[#1E1E1E] p-6 rounded">
                        <h3 className="text-[18px] font-semibold mb-4">Order Summary</h3>
                        <div className="bg-[#2A2A2A] p-4 rounded space-y-2">
                            <p className="text-[16px">
                                <span className="text-gray-300">Model:</span> BMW 3 Series
                            </p>
                            <p className="text-[16px">
                                <span className="text-gray-300">Seat Material:</span> Black
                            </p>
                            <p className="text-[16px">
                                <span className="text-gray-300">Wheel:</span> Standard
                            </p>
                            <p className="text-[16px]">
                                <span className="text-gray-300">Spoiler:</span> None
                            </p>

                            <hr className="border-gray-600 my-2" />

                            <p className="text-[16px] flex justify-between">
                                <span className="text-gray-400">Customization Total</span>
                                <span>Rs. 40000</span>
                            </p>
                            <p className="text-[16px] flex justify-between">
                                <span className="text-gray-400">Service Fee</span>
                                <span>Rs. 1000</span>
                            </p>
                            <p className="text-[16px] flex justify-between font-semibold mt-2">
                                <span>Total</span>
                                <span>Rs. 41000</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>



            <Footer />
        </>
    );
}
