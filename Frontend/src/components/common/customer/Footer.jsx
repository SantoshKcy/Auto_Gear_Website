import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black text-white mt-0 pt-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-8">
                <div>
                    {/* Logo + Heading */}
                    <div className="flex items-center mb-2 space-x-2">
                        <img
                            src="/src/assets/images/no-bg-logo.png"
                            alt="AutoGear Logo"
                            className="h-10 w-10"
                        />
                        <h2 className="text-[18px] font-bold">Auto Gear</h2>
                    </div>

                    {/* Description */}
                    <p className="text-[16px] text-gray-400 mb-3">
                        Transforming vehicles with premium customization and modification services.
                    </p>

                    {/* Social Icons */}
                    <div className="flex space-x-3 text-white">
                        <a
                            href="#"
                            className="transition-colors duration-200 hover:text-[#1877F2]" // Facebook Blue
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="transition-colors duration-200 hover:text-[#E1306C]" // Instagram pink
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="transition-colors duration-200 hover:text-[#0A66C2]" // LinkedIn blue
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
                <div>
                    <h2 className="font-bold mb-2 text-[18px]">Quick Links</h2>
                    <ul className="text-[16px] space-y-2">
                        <li><a href="/">Home</a></li>
                        <li><a href="/shop">Shop</a></li>
                        <li><a href="/customize">Customize</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/faq">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h2 className="font-bold mb-2 text-[18px]">Services</h2>
                    <ul className="text-[16px] space-y-2">
                        <li>Exterior Customization</li>
                        <li>Interior Upgrades</li>
                        <li>Performance Tuning</li>
                        <li>Compatibility Check</li>
                    </ul>
                </div>
                <div>
                    <h2 className="font-bold text-[18px] mb-2">Contact Us</h2>
                    <div className="space-y-2">
                        <p className="text-[16px] flex items-center space-x-2">
                            <Phone className="w-4 h-4" /> <span>9840922949</span>
                        </p>
                        <p className="text-[16px] flex items-center space-x-2">
                            <Mail className="w-4 h-4" /> <span>auto.gear2026@gmail.com</span>
                        </p>
                        <p className="text-[16px] flex items-center space-x-2">
                            <MapPin className="w-4 h-4" /> <span>44300 New Baneshwor, Kathmandu</span>
                        </p>
                    </div>
                </div>

            </div>
            <div className="text-center mt-6 border-t border-gray-700 pt-4 text-sm text-gray-400">
                © 2025 AutoGear. All rights reserved.
                <span className="mx-2">|</span>
                <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                <span className="mx-2">|</span>
                <Link to="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link>
            </div>
        </footer>
    );
};

export default Footer;
