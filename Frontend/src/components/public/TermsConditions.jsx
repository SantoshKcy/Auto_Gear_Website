import { Link } from 'react-router-dom';
import Footer from '../common/customer/Footer';
import Navbar from '../common/customer/Navbar';

export default function TermsConditions() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-6 md:px-10 py-10">
                {/* Breadcrumb + Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-1">Terms & Conditions</h1>
                    <nav className="text-sm text-[#E0E0E0] mb-4">
                        <Link to="/" className="hover:underline">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">Terms & Conditions</span>
                    </nav>
                </div>

                {/* Content */}
                <div className="space-y-6 text-[16px] text-gray-300 leading-relaxed">
                    <p>
                        By accessing and using Auto Gear, you agree to comply with the following Terms and Conditions.
                        These terms apply to all visitors, users, and others who access or use the service.
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-6">1. Use of Platform</h2>
                    <p>
                        You may use the platform for browsing, purchasing car modification parts, using the 3D preview tool,
                        and managing your account. You must not misuse the site or attempt unauthorized access.
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-6">2. Product Information</h2>
                    <p>
                        We make every effort to display accurate product details, prices, and compatibility information.
                        In rare cases of errors, we reserve the right to correct and update information without notice.
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-6">3. Orders & Payments</h2>
                    <p>
                        Orders are subject to availability and acceptance. Payment must be completed before shipping.
                        We offer multiple payment methods, and sensitive data is processed securely.
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-6">4. Returns & Refunds</h2>
                    <p>
                        Products may be returned within 7 days if they are unused and in original condition.
                        Refunds are processed after inspection. Compatibility-related returns are only accepted if
                        verified using our platform’s fit-check system.
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-6">5. Intellectual Property</h2>
                    <p>
                        All designs, branding, and content on Auto Gear are protected by copyright and intellectual property laws.
                        You may not copy, modify, or distribute content without permission.
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-6">6. Changes to Terms</h2>
                    <p>
                        We reserve the right to update these Terms and Conditions at any time. Changes will be posted on this page.
                        Continued use of the site means you agree to the revised terms.
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-6">7. Contact Us</h2>
                    <p>
                        For any questions or concerns about these terms, please contact us at:
                        <br />
                        <span className="text-white">support@autogear.com</span>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}
