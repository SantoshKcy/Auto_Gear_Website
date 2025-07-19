// src/pages/PrivacyPolicy.jsx
import { Link } from 'react-router-dom';
import Footer from '../common/customer/Footer';
import Navbar from '../common/customer/Navbar';

export default function PrivacyPolicy() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-6 md:px-10 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-1">Privacy Policy</h1>
                    <nav className="text-sm text-[#E0E0E0] mb-4">
                        <Link to="/" className="hover:underline">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">Privacy Policy</span>
                    </nav>
                </div>

                <div className="space-y-4 text-[16px] text-gray-300 max-w-3xl">
                    <p>We are committed to protecting your personal data and privacy. This policy outlines how we collect, use, and safeguard your information.</p>

                    <h2 className="text-xl font-semibold text-white mt-6">1. Information Collection</h2>
                    <p>We collect your name, email, address, and vehicle preferences during sign-up, purchases, and customization tools.</p>

                    <h2 className="text-xl font-semibold text-white mt-6">2. Use of Information</h2>
                    <p>Your information helps us:
                        <ul className="list-disc list-inside">
                            <li>Process orders and deliver products</li>
                            <li>Offer personalized services and product recommendations</li>
                            <li>Enhance platform features and user experience</li>
                        </ul>
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-6">3. Data Security</h2>
                    <p>We use encryption, secure servers, and role-based access controls to protect your data.</p>

                    <h2 className="text-xl font-semibold text-white mt-6">4. Third-Party Sharing</h2>
                    <p>We do not sell your data. We only share data with trusted partners for order fulfillment and analytics.</p>

                    <h2 className="text-xl font-semibold text-white mt-6">5. Cookies</h2>
                    <p>We use cookies to remember your preferences and improve our website performance.</p>

                    <h2 className="text-xl font-semibold text-white mt-6">6. Your Rights</h2>
                    <p>You may request to view, update, or delete your personal information anytime.</p>
                </div>
            </div>
            <Footer />
        </>
    );
}
