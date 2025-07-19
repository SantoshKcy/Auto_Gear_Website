
import Navbar1 from "../common/customer/Navbar1";
export default function Summary() {
    return (
        <>
            <Navbar1 />
            <div className="min-h-screen bg-[#101010] text-white font-rajdhani ">
                {/* Top Nav Tabs */}
                <div className="flex space-x-6 text-[18px] px-8 pt-6 border-b border-gray-700 sticky w-full top-0 left-0 z-50">
                    {['Model', 'Exterior', 'Interior', 'Packages', 'Stickers', 'Summary'].map((tab, index) => (
                        <button
                            key={index}
                            className={`pb-2 ${tab === 'Summary'
                                ? 'border-b-2 border-[#FF4500] text-white'
                                : 'text-[#E0E0E0] hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex flex-col md:flex-row px-8 py-6 gap-8">
                    {/* Left Section */}
                    <div className="md:w-2/3 space-y-6">
                        {/* Car Images */}
                        <div className="space-y-4">
                            <img
                                src="src/assets/images/side1.png"
                                alt="Side View"
                                className="w-full rounded object-cover"
                            />
                            <img
                                src="src/assets/images/interior.png"
                                alt="Interior View"
                                className="w-full rounded object-cover"
                            />
                            <div className="flex space-x-4">
                                <img
                                    src="src/assets/images/side1.png"
                                    alt="Rear View"
                                    className="w-1/2 rounded object-cover"
                                />
                                <img
                                    src="src/assets/images/side2.png"
                                    alt="Side View 2"
                                    className="w-1/2 rounded object-cover"
                                />
                            </div>
                        </div>

                        {/* Selected Configuration Summary */}
                        <div className="space-y-4 text-[16px]">
                            {/* Exterior */}
                            <div>
                                <p className="text-[18px] font-semibold">Exterior</p>
                                <div className="flex items-center justify-between text-gray-300 mt-1">
                                    <span>Black</span>
                                    <span>Rs. 2000</span>
                                </div>
                            </div>

                            {/* Interior */}
                            <div>
                                <p className="text-[18px] font-semibold">Interior</p>
                                <div className="flex items-center justify-between text-gray-300 mt-1">
                                    <span>Standard Fabric</span>
                                    <span>Rs. 2000</span>
                                </div>
                            </div>

                            {/* Packages */}
                            <div>
                                <p className="text-[18px] font-semibold">Packages</p>
                                <div className="flex items-center justify-between text-gray-300 mt-1">
                                    <span>Style Package</span>
                                    <span>Rs. 12000</span>
                                </div>
                            </div>

                            {/* Total Price */}
                            <div className="border-t border-gray-700 pt-4 mt-2 flex justify-between font-semibold text-[18px]">
                                <span>Total Price</span>
                                <span>Rs. 16000</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="md:w-1/3 bg-[#1E1E1E] p-6 rounded space-y-6 text-[16px]">
                        <div className="space-y-2">
                            <p className="text-[18px] font-semibold">Your Ride</p>
                            <p className="text-gray-300">X4 M40i</p>
                        </div>

                        <div className="flex space-x-2">
                            <button className="bg-[#2c2c2c] text-white px-4 py-2 rounded hover:bg-[#3a3a3a]">
                                Save Configuration
                            </button>
                            <button className="bg-[#2c2c2c] text-white px-4 py-2 rounded hover:bg-[#3a3a3a]">
                                Share Configuration
                            </button>
                        </div>

                        <div className="border-t border-gray-700 pt-4">
                            <p className="text-[18px] font-semibold mb-2">Total Price</p>
                            <p className="text-[18px] text-white">Rs. 16000</p>
                        </div>

                        <button className="w-full bg-[#FF4500] text-white py-2 rounded hover:bg-orange-600 text-[18px]">
                            Continue to Booking
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
