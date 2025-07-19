import {
    ChevronDown,
    ChevronUp,
    MessageSquare,
    Phone,
    Tag
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../common/customer/Footer';
import Navbar from "../common/customer/Navbar";

const faqData = [
    {
        title: 'General Questions',
        description: 'Common questions about Auto Gear and car customization',
        icon: <MessageSquare className="text-white" size={20} />,
        questions: [
            {
                q: 'What is Auto Gear?',
                a: 'Auto Gear is an online platform for car modification parts and accessories, offering 3D previews and compatibility tools.',
            },
            {
                q: 'Do you sell genuine branded products?',
                a: 'Yes, all products listed are verified and sourced from trusted manufacturers and brands.',
            },
            {
                q: 'Can I customize parts before buying?',
                a: 'Yes, use our 3D visualizer to preview how selected parts look on your car model.',
            },
            {
                q: 'What if a product doesn’t fit my vehicle?',
                a: 'Use the compatibility filter. If something doesn’t fit, you’re eligible for a return based on our policy.',
            },
        ],
    },
    {
        title: 'Shopping & Orders',
        description: 'Info about ordering, payments, and checkout',
        icon: <Tag className="text-white" size={20} />,
        questions: [
            {
                q: 'How do I place an order?',
                a: 'Browse products, select variants, and click “Add to Cart.” Then proceed to checkout.',
            },
            {
                q: 'What payment methods do you support?',
                a: 'We accept major credit/debit cards, digital wallets, and cash-on-delivery in selected areas.',
            },
            {
                q: 'Can I update or cancel my order?',
                a: 'Yes, you can modify or cancel your order before it’s shipped by contacting support.',
            },
            {
                q: 'Do you charge for shipping?',
                a: 'Shipping is free on orders above Rs. 5000. Otherwise, a flat fee applies.',
            },
        ],
    },
    {
        title: 'Account & Wishlist',
        description: 'Managing profile, saved items, and preferences',
        icon: <Phone className="text-white" size={20} />,
        questions: [
            {
                q: 'How do I save items to my wishlist?',
                a: 'Click the heart icon on any product to add it to your wishlist. Login is required.',
            },
            {
                q: 'Can I access my order history?',
                a: 'Yes, your order history is available in the profile dashboard after logging in.',
            },
            {
                q: 'How can I update my address or contact details?',
                a: 'Go to your profile settings and edit your personal information anytime.',
            },
            {
                q: 'Is my data safe on your platform?',
                a: 'Yes, we use encrypted connections and secure storage to protect your data.',
            },
        ],
    },
];

export default function Faq() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-6 md:px-10 py-10">

                {/* Breadcrumb + Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-1">Frequently Asked Questions</h1>
                    <nav className="text-sm text-[#E0E0E0] mb-4">
                        <Link to="/" className="hover:underline">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">FAQ</span>
                    </nav>
                </div>

                {/* FAQ Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {faqData.map((section, index) => (
                        <FaqCard key={index} section={section} />
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}

function FaqCard({ section }) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    return (
        <div className="bg-[#1E1E1E] p-5 rounded space-y-4">
            <div className="flex items-center space-x-2">
                {section.icon}
                <div>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <p className="text-[16px] text-gray-400">{section.description}</p>
                </div>
            </div>

            <div className="divide-y divide-gray-700">
                {section.questions.map(({ q, a }, idx) => (
                    <div key={idx} className="py-3">
                        <button
                            onClick={() => toggle(idx)}
                            className="w-full flex justify-between items-center text-gray-300 hover:text-white text-[16px]"
                        >
                            <span>{q}</span>
                            {openIndex === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {openIndex === idx && (
                            <p className="text-sm text-gray-400 mt-2 leading-relaxed">{a}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
