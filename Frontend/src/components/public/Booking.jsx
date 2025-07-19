import { CalendarDays, ChevronDown } from 'lucide-react';
import Footer from '../common/customer/Footer';
import Navbar from "../common/customer/Navbar";

export default function Booking() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-6 py-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-[18px] font-medium">Book Your Appointment</h1>
                    <p className="text-lg text-gray-300">
                        Schedule a time for our experts to implement your customizations
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Appointment Form */}
                    <div className="bg-[#1E1E1E] p-6 rounded space-y-4">
                        <h2 className="text-[18px] font-semibold mb-4">Appointment Details</h2>

                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full bg-[#2c2c2c] h-[42px]  px-3 rounded text-[16px] placeholder-white focus:outline-none"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full bg-[#2c2c2c] h-[42px] px-3 rounded text-[16px] placeholder-white focus:outline-none"
                        />

                        <input
                            type="tel"
                            placeholder="Phone"
                            className="w-full bg-[#2c2c2c] h-[42px] px-3 rounded text-[16px] placeholder-white focus:outline-none"
                        />

                        {/* Date Picker */}
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2  text-lg text-white">
                                <CalendarDays size={16} />
                            </div>
                            <input
                                type="date"
                                className="w-full bg-[#2c2c2c] h-[42px] pl-10 pr-3 rounded text-[16px] placeholder-gray-200 focus:outline-none"
                            />
                        </div>

                        {/* Time Dropdown */}
                        <div className="relative">
                            <select className="w-full bg-[#2c2c2c] h-[42px] pl-3 pr-8 rounded text-[16px] appearance-none focus:outline-none">
                                <option>Select Appointment Time</option>
                                <option>10:00 AM</option>
                                <option>12:00 PM</option>
                                <option>3:00 PM</option>
                                <option>5:00 PM</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-200 pointer-events-none" size={16} />
                        </div>

                        <textarea
                            placeholder="Additional Notes"
                            rows="4"
                            className="w-full bg-[#2c2c2c] px-3 py-2 rounded text-[16px] placeholder-gray-200 focus:outline-none resize-none"
                        ></textarea>

                        <button className="w-full bg-[#FF4500] text-white text-[18px] font-medium h-[36px] rounded hover:bg-orange-600">
                            Continue
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-[#1E1E1E] p-6 rounded">
                        <h2 className="text-[18px] font-semibold mb-4">Order Summary</h2>
                        <div className="border border-gray-700 p-4 rounded space-y-3">
                            <p className="text-[16px] font-semibold mb-2">Current Configuration</p>
                            <div className="text-[16px] text-gray-300 space-y-1">
                                <p>
                                    <span className="text-white">Model:</span> BMW i4 M50
                                </p>
                                <p>
                                    <span className="text-white">Color:</span> Black
                                </p>
                                <p>
                                    <span className="text-white">Seat Material:</span> Standard Fabric
                                </p>
                                <p>
                                    <span className="text-white">Package:</span> Style Package
                                </p>
                            </div>

                            <div className="border-t border-gray-600 my-2" />

                            <div className="flex justify-between text-[16px] text-gray-300">
                                <span>Customization Total</span>
                                <span>Rs. 16,000</span>
                            </div>
                            <div className="flex justify-between text-[16px] text-gray-300">
                                <span>Service Fee</span>
                                <span>Rs. 1,000</span>
                            </div>

                            <div className="flex justify-between text-[15p6] font-semibold text-white mt-3">
                                <span>Total</span>
                                <span>Rs. 17,000</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
