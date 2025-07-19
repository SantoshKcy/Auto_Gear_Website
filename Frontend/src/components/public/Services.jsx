import {
    Car,
    Heart,
    Rotate3D,
    ShoppingCart,
    Wrench
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../common/customer/Footer';
import Navbar from "../common/customer/Navbar";

export default function Services() {
    const services = [
        {
            title: 'Car Customization',
            description: 'Tailor your car’s look with custom colors, wheels, interiors, and more.',
            icon: <Car size={32} className="text-white" />,
        },
        {
            title: 'Compatibility Check',
            description: 'Ensure parts and accessories fit your car model before purchasing.',
            icon: <Wrench size={32} className="text-white" />,
        },
        {
            title: '3D Vehicle Preview',
            description: 'Visualize your customized vehicle in 3D before you commit.',
            icon: <Rotate3D size={32} className="text-white" />,
        },
        {
            title: 'Wishlist & Save',
            description: 'Save your favorite parts and revisit them anytime for future upgrades.',
            icon: <Heart size={32} className="text-white" />,
        },
        {
    title: 'Buy Parts',
    description: 'Purchase individual car parts for direct delivery or installation.',
    icon: <ShoppingCart size={32} className="text-white" />,
},

        {
            title: 'Expert Support',
            description: 'Get assistance from professionals at every step of the customization process.',
            icon: <Wrench size={32} className="text-white" />,
        },
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-6 md:px-10 py-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-1">Our Services</h2>
                    <nav className="text-sm text-[#E0E0E0]">
                        <Link to="/" className="hover:underline">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">Services</span>
                    </nav>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
                    {services.map((service, i) => (
                        <div key={i} className="bg-[#1E1E1E] rounded p-6 hover:bg-[#2c2c2c] transition-all">
                            <div className="text-3xl mb-4">{service.icon}</div>
                            <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                            <p className="text-sm text-gray-400">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
