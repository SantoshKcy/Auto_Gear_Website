import { Heart, MoreVertical, Share2 } from 'lucide-react';
import Footer from '../common/customer/Footer';
import Navbar from '../common/customer/Navbar';

export default function GalleryPage() {
    const galleryItems = [
        {
            image: 'src/assets/images/ferrari.png',
            title: 'Ferrari 812',
        },
        {
            image: 'src/assets/images/red.png',
            title: 'Red Sport Coupe',
        },
        {
            image: 'src/assets/images/black.png',
            title: 'Black BMW',
        },
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-6 md:px-10 py-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h2 className="text-[18px] font-semibold">Gallery</h2>
                        <p className="text-[16px] text-gray-300">
                            Browse and get inspired by amazing car designs created by our community
                        </p>
                    </div>
                    <button className="bg-[#FF4500] text-white text-[18px] px-6 py-2 rounded mt-4 md:mt-0">
                        Create New Design
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 space-y-2 md:space-y-0">
                    <input
                        type="text"
                        placeholder="Search gallery"
                        className="bg-[#1E1E1E] border border-gray-600 text-[16px] text-white px-3 py-2 rounded outline-none"
                    />
                    <select className="bg-[#1E1E1E] border border-gray-600 text-[16px] text-white px-3 py-2 rounded outline-none">
                        <option>All Category</option>
                    </select>
                    <select className="bg-[#1E1E1E] border border-gray-600 text-[16px] text-white px-3 py-2 rounded outline-none">
                        <option>All Tags</option>
                    </select>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {galleryItems.map((item, index) => (
                        <div key={index} className="bg-[#1E1E1E] rounded overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                            <div className="p-3 flex justify-between items-center">
                                <span className="text-[16px]">{item.title}</span>
                                <div className="flex space-x-2">
                                    <Heart size={18} className="cursor-pointer text-white hover:text-[#FF4500]" />
                                    <Share2 size={18} className="cursor-pointer text-white hover:text-[#FF4500]" />
                                    <MoreVertical size={18} className="cursor-pointer text-white hover:text-[#FF4500]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
