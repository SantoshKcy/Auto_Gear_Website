import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const customerId = localStorage.getItem('userId');

const ProductUI = ({ tag, products = [] }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [wishlistMap, setWishlistMap] = useState({});

    // Fetch user's wishlist
    const { data: wishlistData } = useQuery({
        queryKey: ['wishlist', customerId],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/wishlist/customer/${customerId}`);
            return res.data?.wishlist || [];
        },
        enabled: !!customerId
    });

    useEffect(() => {
        if (wishlistData) {
            const map = {};
            wishlistData.forEach(item => {
                map[item.productId._id] = true;
            });
            setWishlistMap(map);
        }
    }, [wishlistData]);

    const addToWishlist = useMutation({
        mutationFn: async (productId) => {
            await axios.post('http://localhost:3000/api/v1/wishlist/add', {
                customerId,
                productId
            });
        },
        onSuccess: () => {
            toast.success('Product added to wishlist!');
            queryClient.invalidateQueries(['wishlist', customerId]);
        },
        onError: () => toast.error('Failed to add to wishlist')
    });

    const removeFromWishlist = useMutation({
        mutationFn: async (productId) => {
            await axios.delete(`http://localhost:3000/api/v1/wishlist/remove/${productId}?customerId=${customerId}`);
        },
        onSuccess: () => {
            toast.success('Product removed from wishlist!');
            queryClient.invalidateQueries(['wishlist', customerId]);
        },
        onError: () => toast.error('Failed to remove from wishlist')
    });

    const handleWishlistToggle = (e, productId) => {
        e.preventDefault();
        if (!customerId) {
            toast.error('Please log in first!');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
        const isWishlisted = wishlistMap[productId];
        isWishlisted ? removeFromWishlist.mutate(productId) : addToWishlist.mutate(productId);
    };

    // Determine stock status and styling
    const getStockStatus = (quantity) => {
        if (quantity === 0) {
            return { text: 'Out of Stock', textColor: 'text-red-500' };
        } else if (quantity <= 10 && quantity > 0) {
            return { text: 'Low on Stock', textColor: 'text-yellow-300' };
        } else {
            return { text: 'In Stock', textColor: 'text-green-500' };
        }
    };

    return (
        <>
            <section className="bg-[#1E1E1E] text-white rounded-md py-16 px-8">
                <h2 className="text-2xl font-semibold mb-8">All Products</h2>
                <div className="grid grid-cols-3 gap-6">
                    {[0, 1, 2].map((col) => (
                        <div key={col} className="space-y-6">
                            {products
                                .filter((_, index) => index % 3 === col)
                                .map((product) => {
                                    const isWishlisted = wishlistMap[product._id];
                                    const { text, bg, textColor } = getStockStatus(product.quantity);
                                    return (
                                        <Link
                                            to={`/product/${product._id}`}
                                            key={product._id}
                                            className="bg-[#101010] w-[280px] p-4 rounded-md relative hover:shadow-xl hover:scale-105 transform cursor-pointer transition-transform duration-300 ease-in-out block border"
                                        >
                                            <div className="relative group">
                                                <img
                                                    src={`http://localhost:3000/uploads/${product.image?.[0] || 'default.jpg'}`}
                                                    alt={product.name}
                                                    className="w-full h-[200px] object-cover rounded-md mb-3"
                                                />
                                                <div
                                                    onClick={(e) => handleWishlistToggle(e, product._id)}
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                >
                                                    <div className="bg-black p-2 rounded-full">
                                                        <FaHeart
                                                            className={`w-5 h-5 cursor-pointer ${isWishlisted ? 'text-[#FF000D]' : 'text-white hover:text-[#FF000D]'}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Product Name and Category on same row */}
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="text-[16px] font-medium text-white">{product.name}</h3>
                                                {product.category?.name && (
                                                    <span className={`text-xs text-gray-300 bg-[#FFFFFF1A] px-2 py-1 rounded whitespace-nowrap`}>
                                                        {product.category.name}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-white text-[16px] mb-2">Rs. {product.price}</p>
                                            <div className="flex justify-between items-center">
                                                <p className="text-white text-[16px] line-clamp-2">{product.description}</p>
                                                <span className={`text-xs ${textColor} ${bg} px-2 py-1 rounded whitespace-nowrap`}>
                                                    {text}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                    ))}
                </div>
            </section>

            <ToastContainer
                hideProgressBar
                theme="dark"
                position="top-right"
                autoClose={5000}
                closeOnClick
                pauseOnHover
                draggable
            />
        </>
    );
};

export default ProductUI;