import { Link } from 'react-router-dom';
import Footer from '../common/customer/Footer';
import Navbar from '../common/customer/Navbar';

export default function About() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-6 md:px-10 py-10">
                {/* Heading + Breadcrumb (Left Aligned) */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold mb-1">About Us</h1>
                    <nav className="text-sm text-[#E0E0E0]">
                        <Link to="/" className="hover:underline">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">About</span>
                    </nav>
                </div>

                {/* Our Story */}
                <div className="flex flex-col md:flex-row gap-10 items-center mb-16">
                    <img
                        src="/src/assets/images/story.png"
                        alt="Our Story"
                        className="w-full md:w-1/2 h-[400px] object-cover rounded"
                    />
                    <div className="md:w-1/2 space-y-4">
                        <h2 className="text-2xl font-semibold">Our Story</h2>
                        <p className="text-gray-300 text-[16px]">
                            Auto Gear was founded by a group of passionate car enthusiasts with one goal:
                            to turn ordinary vehicles into extraordinary machines. What started in a small
                            garage has grown into a full-scale customization studio that blends creativity,
                            technology, and craftsmanship.
                        </p>
                        <p className="text-gray-300 text-[16px]">
                            We’ve helped hundreds of customers design vehicles that reflect their personality
                            and passion. Whether it’s a sleek sports car, a rugged SUV, or a luxury sedan — we’ve done it all.
                        </p>
                    </div>
                </div>

                {/* Mission & Values */}
                <div className="flex flex-col-reverse md:flex-row gap-10 items-center mb-16">
                    <div className="md:w-1/2 space-y-4">
                        <h2 className="text-2xl font-semibold">Our Mission & Values</h2>
                        <p className="text-gray-300 text-[16px]">
                            Our mission is to deliver top-tier automotive customization services with a focus
                            on innovation, quality, and customer satisfaction.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-[16px] text-gray-300">
                            <li><strong className="text-white">Quality Craftsmanship:</strong> Every detail matters.</li>
                            <li><strong className="text-white">Customer-Centric:</strong> We design around your vision.</li>
                            <li><strong className="text-white">Innovation:</strong> We stay ahead with the latest trends and tech.</li>
                            <li><strong className="text-white">Transparency:</strong> Honest pricing, clear communication.</li>
                        </ul>
                    </div>
                    <img
                        src="/src/assets/images/bg5.jpg"
                        alt="Mission"
                        className="w-full md:w-1/2 h-[400px] object-cover rounded"
                    />
                </div>
            </div>
            <Footer />
        </>
    );
}
