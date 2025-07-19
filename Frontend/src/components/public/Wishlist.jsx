import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Footer from '../common/customer/Footer';
import Navbar from '../common/customer/Navbar';

const customerId = localStorage.getItem('userId');

export default function Wishlist() {
    const queryClient = useQueryClient();

    const { data: wishlistData, isLoading, error } = useQuery({
        queryKey: ['wishlist', customerId],
        queryFn: async () => {
            const res = await axios.get(
                `http://localhost:3000/api/v1/wishlist/customer/${customerId}`
            );
            return res.data?.wishlist || [];
        },
        enabled: !!customerId
    });

    const removeFromWishlist = useMutation({
        mutationFn: async (productId) => {
            await axios.delete(
                `http://localhost:3000/api/v1/wishlist/remove/${productId}?customerId=${customerId}`
            );
        },
        onSuccess: () => {
            toast.success('Product removed from wishlist!');
            queryClient.invalidateQueries(['wishlist', customerId]);
        },
        onError: () => toast.error('Failed to remove from wishlist')
    });

    const clearWishlist = useMutation({
        mutationFn: async () => {
            await axios.delete(
                `http://localhost:3000/api/v1/wishlist/${customerId}`
            );
        },
        onSuccess: () => {
            toast.success('Wishlist cleared!');
            queryClient.invalidateQueries(['wishlist', customerId]);
        },
        onError: () => toast.error('Failed to clear wishlist')
    });

    return (
        <>
            <Navbar />
            <section className="min-h-screen bg-[#171717] text-white py-16 px-8 font-rajdhani">
                {/* Breadcrumb + Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-1">Your Wishlist</h1>
                    <nav className="text-sm text-[#E0E0E0] mb-4">
                        <Link to="/" className="hover:underline">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">Wishlist</span>
                    </nav>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Saved Products</h2>
                    {wishlistData?.length > 0 && (
                        <button
                            onClick={() => clearWishlist.mutate()}
                            className="text-white border-b-[1px]"
                        >
                            Clear Wishlist
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="text-white py-16">Loading wishlist...</div>
                ) : error ? (
                    <div className="text-red-500 py-16">Failed to load wishlist.</div>
                ) : wishlistData.length === 0 ? (
                    <p className="text-gray-400">Your wishlist is empty.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                        {wishlistData.map((item) => (
                            <div
                                key={item.productId._id}
                                className="bg-[#101010] p-4 rounded-md relative hover:shadow-xl hover:scale-105 transform transition-transform duration-300 ease-in-out"
                            >
                                <Link to={`/product/${item.productId._id}`} className="block">
                                    <img
                                        src={`http://localhost:3000/uploads/${item.productId.image?.[0] || 'default.jpg'}`}
                                        alt={item.productId.name}
                                        className="w-full h-32 object-cover rounded-md mb-3"
                                    />
                                    <h3 className="text-[16px] font-medium mb-1">{item.productId.name}</h3>
                                    <p className="text-white text-[16px] mb-2">Rs. {item.productId.price}</p>
                                    <p className="text-white text-[16px] line-clamp-2">{item.productId.description}</p>
                                </Link>
                                <button
                                    onClick={() => removeFromWishlist.mutate(item.productId._id)}
                                    className="absolute top-2 right-2 p-2 bg-black/70 rounded-full hover:bg-red-700 transition"
                                >
                                    <FaTrash className="text-white text-sm" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <ToastContainer
                    hideProgressBar
                    theme="dark"
                    position="top-right"
                    autoClose={4000}
                    closeOnClick
                    pauseOnHover
                    draggable
                />
            </section>
            <Footer />
        </>
    );
}
