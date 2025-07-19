import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../common/customer/Footer';
import Navbar from '../common/customer/Navbar';
import axios from 'axios';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Contact() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        message: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        const { firstName, lastName, email, phone, address, message } = form;
        if (!firstName || !lastName || !email || !phone || !address || !message) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            const res = await axios.post('http://localhost:3000/api/v1/contact', form);
            toast.success('Enquiry submitted successfully!');
            setForm({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                message: ''
            });
        } catch (error) {
            toast.error('Failed to submit enquiry');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#101010] text-white font-rajdhani">
                {/* Header + Breadcrumb */}
                <div className="px-6 md:px-10 pt-10">
                    <h1 className="text-3xl font-bold mb-1">Contact Us</h1>
                    <nav className="text-sm text-[#E0E0E0] mb-6">
                        <Link to="/" className="hover:underline">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">Contact</span>
                    </nav>
                </div>

                {/* Map Background with Contact Info Card */}
                <div className="relative h-[400px] w-full">
                    <iframe
                        className="absolute inset-0 w-full h-full object-cover"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0905631826397!2d85.34354677541428!3d27.69970282658554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1983283f13eb%3A0xf0f1aafae9f1d193!2sNew%20Baneshwor%20Chowk%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1719399999999"
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>

                    <div className="absolute inset-0" />

                    <div className="absolute left-10 top-1/2 transform -translate-y-1/2 bg-[#1E1E1E] p-6 rounded-md w-[350px] space-y-4 z-10">
                        <h2 className="text-2xl font-semibold">Get in Touch</h2>
                        <div className="space-y-3 text-[16px]">
                            <div className="flex items-center space-x-3">
                                <Phone size={20} />
                                <span>+977-9812345678</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail size={20} />
                                <span>support@autogear.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin size={20} />
                                <span>New Baneshwor Chowk, Kathmandu</span>
                            </div>
                            <div className="flex items-center space-x-4 pt-2">
                                <Facebook className="text-gray-400 hover:text-white cursor-pointer" />
                                <Twitter className="text-gray-400 hover:text-white cursor-pointer" />
                                <Instagram className="text-gray-400 hover:text-white cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enquiry Form */}
                <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
                    <div className="bg-[#1E1E1E] rounded-md p-6 space-y-6">
                        <h2 className="text-2xl font-semibold mb-2">Send an Enquiry</h2>
                        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 text-white text-[16px]">
                            <input
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="p-3 rounded bg-[#1E1E1E] border border-gray-600 placeholder-gray-400"
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="p-3 rounded bg-[#1E1E1E] border border-gray-600 placeholder-gray-400"
                            />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="p-3 rounded bg-[#1E1E1E] border border-gray-600 placeholder-gray-400"
                            />
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="p-3 rounded bg-[#1E1E1E] border border-gray-600 placeholder-gray-400"
                            />
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Current Address"
                                className="md:col-span-2 p-3 rounded bg-[#1E1E1E] border border-gray-600 placeholder-gray-400"
                            />
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Message"
                                className="md:col-span-2 p-3 rounded bg-[#1E1E1E] border border-gray-600 placeholder-gray-400"
                            ></textarea>
                            <button
                                type="submit"
                                className="md:col-span-2 text-[18px] bg-[#FF4500] hover:bg-[#e63b00] text-white w-[100px] px-6 py-2 rounded"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Footer />
        </>
    );
}
