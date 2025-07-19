
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRef } from 'react';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Footer from '../common/customer/Footer';
import Navbar from '../common/customer/Navbar';
import 'react-toastify/dist/ReactToastify.css';

const customerId = localStorage.getItem('userId');

export default function Cart() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isProcessing = useRef(false); // Debounce flag

    const { data: cart, isLoading } = useQuery({
        queryKey: ['cart', customerId],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/cart/${customerId}`);
            return res.data;
        },
        enabled: !!customerId,
    });

    // Determine stock status and styling
    const getStockStatus = (quantity) => {
        if (quantity === 0) {
            return { text: 'Out of Stock', bg: 'bg-[#FFFFFF1A]', textColor: 'text-red-500' };
        } else if (quantity <= 10 && quantity > 0) {
            return { text: 'Low on Stock', bg: 'bg-[#FFFFFF1A]', textColor: 'text-yellow-300' };
        } else {
            return { text: 'In Stock', bg: 'bg-[#FFFFFF1A]', textColor: 'text-green-500' };
        }
    };

    const updateQuantity = useMutation({
        mutationFn: async ({ productId, quantity, selectedVariant }) => {
            if (quantity <= 0) {
                throw new Error('Quantity must be at least 1');
            }
            return axios.put('http://localhost:3000/api/v1/cart', {
                customerId,
                productId,
                quantity,
                selectedVariant,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['cart', customerId]);
            toast.dismiss();
            toast.success('Cart updated successfully!');
        },
        onError: (error) => {
            console.error('Update quantity failed', error);
            toast.dismiss();
            toast.error('Failed to update cart quantity.');
        },
    });

    const removeItem = useMutation({
        mutationFn: async ({ productId, selectedVariant }) => {
            return axios.delete(`http://localhost:3000/api/v1/cart/remove/${productId}`, {
                params: {
                    customerId,
                    variantKey: JSON.stringify(selectedVariant),
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['cart', customerId]);
            toast.dismiss();
            toast.info('Item removed from cart.');
        },
        onError: (error) => {
            console.error('Remove item failed', error);
            toast.dismiss();
            toast.error('Failed to remove item from cart.');
        },
    });

    const clearCart = useMutation({
        mutationFn: async () => {
            return axios.delete(`http://localhost:3000/api/v1/cart/${customerId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['cart', customerId]);
            toast.dismiss();
            toast.info('Cart cleared successfully.');
        },
        onError: (error) => {
            console.error('Clear cart failed', error);
            toast.dismiss();
            toast.error('Failed to clear cart.');
        },
    });

    const handleQuantityChange = (item, type) => {
        if (isProcessing.current) return;
        isProcessing.current = true;

        const newQuantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;

        if (type === 'increase' && newQuantity > item.productId.quantity) {
            toast.dismiss();
            toast.error(`Cannot add more. Only ${item.productId.quantity} items in stock.`);
            isProcessing.current = false;
            return;
        }

        if (newQuantity < 1) {
            isProcessing.current = false;
            return;
        }

        updateQuantity.mutate(
            {
                productId: item.productId._id,
                quantity: newQuantity,
                selectedVariant: item.selectedVariant,
            },
            {
                onSettled: () => {
                    isProcessing.current = false;
                },
            }
        );
    };

    const handleProceedToCheckout = () => {
        if (!customerId) {
            toast.dismiss();
            toast.error('Please log in to proceed to checkout.');
            return;
        }

        if (!cart?.products?.length) {
            toast.dismiss();
            toast.error('Your cart is empty.');
            return;
        }

        navigate('/checkout', { state: { cart } });
    };

    if (isLoading) return <div className="text-white p-10">Loading Cart...</div>;

    const cartItems = cart?.products || [];
    const subtotal = cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
    const tax = subtotal * 0.13;
    const shipping = 500;
    const total = subtotal + tax + shipping;

    return (
        <>
            <Navbar />
            <div className="bg-[#101010] text-white px-6 md:px-10 py-10 font-rajdhani min-h-screen">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-1">Your Cart</h1>
                    <nav className="text-sm text-[#E0E0E0] mb-4">
                        <Link to="/" className="hover:underline">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">Cart</span>
                    </nav>
                </div>

                {cartItems.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="md:col-span-2 space-y-6">
                            {cartItems.map((item, index) => {
                                const { text, bg, textColor } = getStockStatus(item.productId.quantity);
                                return (
                                    <div key={index} className="bg-[#1E1E1E] p-4 rounded flex items-center gap-4">
                                        <Link to={`/product/${item.productId._id}`}>
                                            <img
                                                src={`http://localhost:3000/uploads/${item.productId.image[0]}`}
                                                alt={item.productId.name}
                                                className="w-24 h-24 object-cover rounded cursor-pointer"
                                            />
                                        </Link>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                                                <span className={`text-xs ${textColor} ${bg} px-2 py-1 rounded whitespace-nowrap`}>
                                                    {text}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span>Price: Rs. {item.productId.price.toFixed(2)}</span>
                                                <span className="flex items-center gap-2">
                                                    Qty:
                                                    <button
                                                        onClick={() => handleQuantityChange(item, 'decrease')}
                                                        className={`p-1 bg-gray-700 rounded ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        readOnly
                                                        value={item.quantity}
                                                        className="w-12 p-1 bg-[#101010] border border-gray-600 rounded text-white text-center"
                                                    />
                                                    <button
                                                        onClick={() => handleQuantityChange(item, 'increase')}
                                                        className={`p-1 bg-gray-700 rounded ${item.quantity >= item.productId.quantity ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={item.quantity >= item.productId.quantity}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </span>
                                                <span>Total: Rs. {(item.productId.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                            {(item.selectedVariant.material || item.selectedVariant.color || item.selectedVariant.dimensions) && (
                                                <div className="text-sm text-gray-300 mt-2">
                                                    {item.selectedVariant.material && <span>Material: {item.selectedVariant.material} | </span>}
                                                    {item.selectedVariant.color && <span>Color: {item.selectedVariant.color} | </span>}
                                                    {item.selectedVariant.dimensions && <span>Dimensions: {item.selectedVariant.dimensions}</span>}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeItem.mutate({ productId: item.productId._id, selectedVariant: item.selectedVariant })}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                );
                            })}
                            <button
                                onClick={() => {
                                    if (!isProcessing.current) {
                                        isProcessing.current = true;
                                        clearCart.mutate(null, {
                                            onSettled: () => {
                                                isProcessing.current = false;
                                            },
                                        });
                                    }
                                }}
                                className="text-white border-b-[1px] mt-2"
                            >
                                Clear Cart
                            </button>
                        </div>

                        <div className="bg-[#1E1E1E] p-6 rounded space-y-4 h-fit">
                            <h2 className="text-xl font-semibold">Cart Summary</h2>
                            <div className="text-[16px] text-gray-300 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Estimated Tax (13%)</span>
                                    <span>Rs. {tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Rs. {shipping.toFixed(2)}</span>
                                </div>
                                <hr className="border-gray-600 my-2" />
                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>Rs. {total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="justify-center flex items-center mt-4">
                                <button
                                    onClick={handleProceedToCheckout}
                                    className={`bg-[#FF4500] w-[200px] py-2 text-white rounded flex items-center justify-center gap-2 ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={cartItems.length === 0}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Proceed to Checkout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-20">
                        <ShoppingCart className="mx-auto mb-4 w-12 h-12 text-gray-600" />
                        <p className="text-xl font-semibold mb-2">Your cart is empty</p>
                        <p className="text-sm">Looks like you haven’t added any items yet.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="mt-6 bg-[#FF4500] text-white px-6 py-2 rounded"
                        >
                            Browse Products
                        </button>
                    </div>
                )}
            </div>
            <ToastContainer hideProgressBar theme="dark" position="top-right" autoClose={4000} limit={1} />
            <Footer />
        </>
    );
}