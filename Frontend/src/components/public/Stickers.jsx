import {
    ChevronLeft,
    ChevronLeftCircle,
    ChevronRight,
    ChevronRightCircle,
    Flame,
    Move,
    Rocket,
    Scaling,
    Star,
    Trash2,
    Zap,
} from 'lucide-react';
import Navbar1 from "../common/customer/Navbar1";

export default function Stickers() {
    return (
        <>
            <Navbar1 />
            <div className="min-h-screen bg-[#101010] text-white font-rajdhani">
                {/* Top Nav Tabs */}
                <div className="flex space-x-6 text-[18px] px-8 pt-6 border-b border-gray-700 sticky w-full top-0 left-0 z-50">
                    {['Model', 'Exterior', 'Interior', 'Packages', 'Stickers', 'Summary'].map((tab, index) => (
                        <button
                            key={index}
                            className={`pb-2 ${tab === 'Stickers'
                                ? 'border-b-2 border-[#FF4500] text-white'
                                : 'text-[#E0E0E0] hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row px-8 py-6 space-y-10 md:space-y-0 md:space-x-10">
                    {/* Left Section */}
                    <div className="md:w-1/2 space-y-4">
                        {/* Car Image */}
                        <div className="bg-[#1E1E1E] rounded p-4">
                            <img
                                src="src/assets/images/exterior.png"
                                alt="Car side view"
                                className="w-full h-auto object-contain"
                            />
                            <div className="flex justify-between text-[16px] mt-4 text-gray-400">
                                <button className="flex items-center space-x-1 hover:text-white">
                                    <ChevronLeftCircle size={18} />
                                    <span>Vehicle rotate left</span>
                                </button>
                                <button className="hover:text-white">⛶ Expand</button>
                                <button className="flex items-center space-x-1 hover:text-white">
                                    <span>Vehicle rotate right</span>
                                    <ChevronRightCircle size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Current Config */}
                        <div className="bg-[#1E1E1E] rounded p-4">
                            <p className="text-[16px] text-gray-400">Current Configuration</p>
                            <p className="text-[16px] mt-2">
                                Model: <span className="font-semibold text-white">BMW i4 M50</span>
                            </p>
                        </div>
                    </div>

                    <div className="md:w-1/2 bg-[#1E1E1E] p-6 rounded space-y-6">
                        {/* Upload Section */}
                        <div>
                            <h2 className="text-[18px] font-semibold mb-2">Upload Your Own Sticker</h2>
                            <input
                                type="file"
                                className="bg-[#2c2c2c] text-white text-[16px] px-4 py-1 rounded w-full"
                            />
                        </div>

                        {/* Add Text Section */}
                        <div>
                            <h2 className="text-[18px] font-semibold mb-2">Add Text</h2>
                            <input
                                type="text"
                                placeholder="Enter Text"
                                className="bg-[#2c2c2c] text-white text-[16px] px-4 py-2 rounded w-full mb-2"
                            />
                            <div className="flex space-x-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Font"
                                    className="bg-[#2c2c2c] text-white text-[16px] px-3 py-2 rounded w-1/2"
                                />
                                <input
                                    type="color"

                                    className="bg-[#2c2c2c] w-1/2 h-[42px] rounded cursor-pointer"
                                />
                            </div>
                            <button className="w-full bg-[#FF4500] text-white text-[16px] py-2 rounded">
                                Add Text
                            </button>
                        </div>

                        {/* Preset Stickers */}
                        <div>
                            <h2 className="text-[18px] font-semibold mb-2">Preset Stickers</h2>
                            <div className="flex space-x-4">
                                {[Flame, Zap, Star, Rocket].map((Icon, i) => (
                                    <button
                                        key={i}
                                        className="bg-[#2c2c2c] p-2 rounded text-white hover:text-[#FF4500]"
                                    >
                                        <Icon size={24} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sticker Controls */}
                        <div className="mt-4 text-[14px] text-gray-400 space-y-2">
                            <div className="flex items-center space-x-2">
                                <Move size={16} />
                                <span>Drag to position</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Scaling size={16} />
                                <span>Resize using handles</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Trash2 size={16} />
                                <span>Select and press Delete to remove</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Navigation */}
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

