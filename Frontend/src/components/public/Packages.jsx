
import {
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Navbar1 from '../common/customer/Navbar1';
export default function Packages() {
    return (
        <>
            <Navbar1 />
            <div className="min-h-screen bg-[#101010] text-white font-rajdhani">
                {/* Top Nav Tabs */}
                <div className="flex space-x-6 text-[18px] px-8 pt-6 border-b border-gray-700">
                    {['Model', 'Exterior', 'Interior', 'Packages', 'Stickers', 'Summary'].map((tab, index) => (
                        <button
                            key={index}
                            className={`pb-2 ${tab === 'Packages'
                                ? 'border-b-2 border-[#FF4500] text-white'
                                : 'text-[#E0E0E0] hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-8 py-10">
                    {/* Section Title */}
                    <div className="mb-10">
                        <h2 className="text-[18px] font-semibold mb-2">Packages</h2>
                        <p className="text-[16px] text-[#E0E0E0] ">
                            Choose from expertly crafted bundles that combine style, comfort, and performance, all at discounted prices. Save more and customize faster with our pre-designed upgrade packs.
                        </p>
                    </div>

                    {/* Packages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Style Package */}
                        <div className="bg-[#101010] border-[1px] border-gray-700  text-black border-brounded overflow-hidden flex flex-col justify-between">
                            <img src="src/assets/images/style.png" alt="Style Package" className="w-full h-40 object-cover" />
                            <div className="p-4 flex flex-col justify-between h-full">
                                <div>
                                    <h3 className="font-semibold text-[18px] text-white mb-1">Style Package</h3>
                                    <p className="text-sm text-[#E0E0E0] mb-2">Rs. 10000</p>
                                    <ul className="text-sm text-[#E0E0E0] list-disc ml-5 space-y-1">
                                        <li>RetroGlossy Exterior Wrap</li>
                                        <li>Ambient Interior Lighting</li>
                                        <li>Wavy Wheels (17")</li>
                                        <li>Smoked Headlight & Taillight Tint</li>
                                    </ul>
                                </div>
                                <button className="mt-4 bg-[#171717] text-white py-1 px-4 rounded hover:opacity-80">Add</button>
                            </div>
                        </div>

                        {/* Tech & Comfort Package */}
                        <div className="bg-[#101010]  border-[1px] border-gray-700 text-black rounded overflow-hidden flex flex-col justify-between">
                            <img src="src/assets/images/tech.png" alt="Tech & Comfort Package" className="w-full h-40 object-cover" />
                            <div className="p-4 flex flex-col justify-between h-full">
                                <div>
                                    <h3 className="font-semibold text-white text-[18px] mb-1">Tech & Comfort Package</h3>
                                    <p className="text-sm text-[#E0E0E0] mb-2">Rs. 18000</p>
                                    <ul className="text-sm text-[#E0E0E0] list-disc ml-5 space-y-1">
                                        <li>Touchscreen Infotainment System</li>
                                        <li>Rearview Camera</li>
                                        <li>Premium Seat Covers (Leather)</li>
                                        <li>Noise-Reduction Interior Paneling</li>
                                    </ul>
                                </div>
                                <button className="mt-4 bg-[#171717] text-white py-1 px-4 rounded hover:opacity-80">Add</button>
                            </div>
                        </div>

                        {/* Performance Package */}
                        <div className="bg-[#101010] border-[1px] border-gray-700 text-black rounded overflow-hidden flex flex-col justify-between">
                            <img src="src/assets/images/performance.png" alt="Performance Package" className="w-full h-40 object-cover" />
                            <div className="p-4 flex flex-col justify-between h-full">
                                <div>
                                    <h3 className="font-semibold text-white text-[18px] mb-1">Performance Package</h3>
                                    <p className="text-sm text-[#E0E0E0] mb-2">Rs. 22000</p>
                                    <ul className="text-sm text-[#E0E0E0] list-disc ml-5 space-y-1">
                                        <li>Sport Exhaust Tips</li>
                                        <li>AI Ride Upgrade (Visual)</li>
                                        <li>ADV Wheels (19")</li>
                                        <li>Lowered Suspension Kit</li>
                                    </ul>
                                </div>
                                <button className="mt-4 bg-[#171717] text-white py-1 px-4 rounded hover:opacity-80">Add</button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Footer Navigation */}
                <div className="flex justify-between items-center px-8 py-2 bg-[#FF4500] text-white text-[18px]">
                    <button className="flex items-center space-x-1 hover:underline">
                        <ChevronLeft size={20} />
                        <span>Previous</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:underline">
                        <span>Next</span>
                        <ChevronRight size={20} />
                    </button>
                </div>

            </div>
        </>
    );
}
