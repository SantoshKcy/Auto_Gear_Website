import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRef, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Footer from '../common/customer/Footer';
import Navbar from '../common/customer/Navbar';
import StripePaymentWrapper from './StripePayment';
import 'react-toastify/dist/ReactToastify.css';

const customerId = localStorage.getItem('userId');

export default function Checkout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const location = useLocation();
    const isProcessing = useRef(false);
    const [step, setStep] = useState(location.state?.step || 1);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [createdOrderId, setCreatedOrderId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
    });

    const { data: user, isLoading: isUserLoading, error: userError } = useQuery({
        queryKey: ['user', customerId],
        queryFn: async () => {
            console.log('Fetching user data for customerId:', customerId);
            const res = await axios.get(`http://localhost:3000/api/v1/auth/${customerId}`);
            return res.data.data;
        },
        enabled: !!customerId,
        onSuccess: (data) => {
            console.log('User data fetched successfully:', data);
            setShippingAddress((prev) => ({
                ...prev,
                name: `${data.fname} ${data.lname}`.trim() || '',
                email: data.email || '',
                phone: data.phone ? String(data.phone) : '',
            }));
        },
        onError: (error) => {
            console.error('Fetch user failed:', error.message, error.stack);
            toast.dismiss();
            toast.error('Failed to load user details. Please try again.');
        },
    });

    const { data: cartFromAPI, isLoading: isCartLoading } = useQuery({
        queryKey: ['cart', customerId],
        queryFn: async () => {
            console.log('Fetching cart data for customerId:', customerId);
            const res = await axios.get(`http://localhost:3000/api/v1/cart/${customerId}`);
            return res.data;
        },
        enabled: !!customerId && !location.state?.cart,
        onSuccess: (data) => {
            console.log('Cart data fetched successfully:', data);
        },
        onError: (error) => {
            console.error('Fetch cart failed:', error.message, error.stack);
            toast.dismiss();
            toast.error('Failed to load cart details. Please try again.');
        },
    });

    const cart = location.state?.cart || cartFromAPI;

    const getStockStatus = (quantity) => {
        const status = quantity === 0
            ? { text: 'Out of Stock', bg: 'bg-[#FFFFFF1A]', textColor: 'text-red-500' }
            : quantity <= 10
            ? { text: 'Low on Stock', bg: 'bg-[#FFFFFF1A]', textColor: 'text-yellow-300' }
            : { text: 'In Stock', bg: 'bg-[#FFFFFF1A]', textColor: 'text-green-500' };
        console.log(`Stock status for quantity ${quantity}:`, status);
        return status;
    };

    const clearCart = useMutation({
        mutationFn: async () => {
            console.log('Clearing cart for customerId:', customerId);
            return axios.delete(`http://localhost:3000/api/v1/cart/${customerId}`);
        },
        onSuccess: () => {
            console.log('Cart cleared successfully');
            queryClient.invalidateQueries(['cart', customerId]);
        },
        onError: (error) => {
            console.error('Clear cart failed:', error.message, error.stack);
            toast.dismiss();
            toast.error('Failed to clear cart.');
        },
    });

    const createOrder = useMutation({
        mutationFn: async ({ products, totalAmount, paymentMethod, shippingAddress }) => {
            console.log('Creating order with data:', { customerId, products, totalAmount, paymentMethod, shippingAddress });
            return axios.post('http://localhost:3000/api/v1/order', {
                customerId,
                products,
                totalAmount,
                paymentMethod,
                shippingAddress,
            });
        },
        onSuccess: (response) => {
            console.log('Order created successfully:', response.data);
            toast.dismiss();
            toast.success('Order placed successfully!');
            clearCart.mutate();
            setCreatedOrderId(response.data.data._id);
            console.log('Set createdOrderId:', response.data.data._id);
            setStep(3);
        },
        onError: (error) => {
            console.error('Order creation failed:', error.message, error.stack);
            toast.dismiss();
            toast.error(`Failed to place order: ${error.message}`);
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Input changed - ${name}: ${value}`);
        setShippingAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleNextStep = () => {
        console.log('Handling next step, current step:', step);
        if (step === 1) {
            const requiredFields = ['name', 'email', 'phone', 'street', 'city', 'state', 'postalCode'];
            const missingFields = requiredFields.filter((field) => !shippingAddress[field]);
            if (missingFields.length > 0) {
                console.error('Missing required fields:', missingFields);
                toast.dismiss();
                toast.error('Please fill in all required fields.');
                return;
            }
            console.log('Shipping address validated:', shippingAddress);
        }
        setStep((prev) => {
            console.log('Advancing to step:', prev + 1);
            return prev + 1;
        });
    };

    const handlePlaceOrder = () => {
        console.log('Attempting to place order, paymentMethod:', paymentMethod);
        if (!customerId) {
            console.error('No customerId found');
            toast.dismiss();
            toast.error('Please log in to place an order.');
            return;
        }

        if (!cart?.products?.length) {
            console.error('Cart is empty');
            toast.dismiss();
            toast.error('Your cart is empty.');
            return;
        }

        if (isProcessing.current) {
            console.log('Order processing in progress, ignoring request');
            return;
        }
        isProcessing.current = true;

        const invalidItems = cart.products.filter((item) => item.quantity > item.productId.quantity);
        if (invalidItems.length > 0) {
            console.error('Invalid stock for items:', invalidItems.map((item) => item.productId.name));
            toast.dismiss();
            toast.error(`Cannot place order. Insufficient stock for: ${invalidItems.map((item) => item.productId.name).join(', ')}.`);
            isProcessing.current = false;
            return;
        }

        if (paymentMethod === 'Stripe') {
            console.log('Advancing to Stripe payment step (2.5)');
            setStep(2.5);
            isProcessing.current = false;
        } else {
            const products = cart.products.map((item) => ({
                productId: item.productId._id,
                quantity: item.quantity,
                selectedVariant: item.selectedVariant,
            }));

            const totalAmount = cart.products.reduce((acc, item) => acc + item.productId.price * item.quantity, 0) +
                500 + 0.13 * cart.products.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
            console.log('Calculated totalAmount:', totalAmount);

            createOrder.mutate(
                {
                    products,
                    totalAmount,
                    paymentMethod,
                    shippingAddress,
                },
                {
                    onSettled: () => {
                        console.log('Order mutation settled');
                        isProcessing.current = false;
                    },
                }
            );
        }
    };

    const cartItems = cart?.products || [];
    const subtotal = cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
    const tax = subtotal * 0.13;
    const shipping = 500;
    const total = subtotal + tax + shipping;
    console.log('Order summary calculated:', { subtotal, tax, shipping, total });

    const products = cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant,
    }));

    const orderSummary = (
        <div className="bg-[#1E1E1E] p-2 rounded space-y-4 h-fit text-sm text-gray-300">
            <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
            {cartItems.map((item, index) => {
                const { text, bg, textColor } = getStockStatus(item.productId.quantity);
                return (
                    <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Link to={`/product/${item.productId._id}`}>
                                <img
                                    src={`http://localhost:3000/uploads/${item.productId.image[0]}`}
                                    alt={item.productId.name}
                                    className="w-12 h-12 object-cover rounded cursor-pointer"
                                />
                            </Link>
                            <div>
                                <p>{item.productId.name}</p>
                                <p className="text-xs">
                                    Qty: {item.quantity}
                                    {(item.selectedVariant.material || item.selectedVariant.color || item.selectedVariant.dimensions) && (
                                        <span>
                                            {' | '}
                                            {item.selectedVariant.material && `Material: ${item.selectedVariant.material} `}
                                            {item.selectedVariant.color && `Color: ${item.selectedVariant.color} `}
                                            {item.selectedVariant.dimensions && `Dimensions: ${item.selectedVariant.dimensions}`}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <span>Rs. {(item.productId.price * item.quantity).toFixed(2)} (NPR)</span>
                    </div>
                );
            })}
            <div className="flex justify-between">
                <span>Shipping</span>
                <span>Rs. {shipping.toFixed(2)} (NPR)</span>
            </div>
            <div className="flex justify-between">
                <span>Tax</span>
                <span>Rs. {tax.toFixed(2)} (NPR)</span>
            </div>
            <hr className="border-gray-600 my-2" />
            <div className="flex justify-between font-semibold text-white">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)} (NPR)</span>
            </div>
        </div>
    );

    const ProgressIndicator = () => (
        <div className="flex items-center justify-between max-w-lg mx-auto mb-10">
            {[1, 2, 3].map((s, index) => (
                <div key={s} className="flex items-center w-full">
                    <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold z-10 ${
                            step >= s ? 'bg-[#FF4500] text-white' : 'bg-[#1E1E1E] border border-gray-500 text-gray-400'
                        }`}
                    >
                        {s}
                    </div>
                    {index < 2 && (
                        <div className={`flex-grow h-0.5 ${step > s ? 'bg-[#FF4500]' : 'bg-gray-600'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );

    if (isCartLoading && !cart) {
        console.log('Cart is loading and no cart data available');
        return <div className="text-white p-10">Loading Checkout...</div>;
    }
    if (userError) {
        console.log('User error encountered:', userError);
        return <div className="text-red-500 p-10">Failed to load user details. Please try again.</div>;
    }

    return (
        <>
            <Navbar />
            <div className="bg-[#101010] text-white px-6 md:px-10 py-10 font-rajdhani min-h-screen">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>
                <ProgressIndicator />

                <div className="grid md:grid-cols-3 gap-10">
                    <div className="md:col-span-2 space-y-6">
                        {step === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold mb-4">Billing & Shipping Information</h2>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={shippingAddress.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-[#1E1E1E] border border-gray-600 rounded text-white"
                                    disabled={isUserLoading}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={shippingAddress.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-[#1E1E1E] border border-gray-600 rounded text-white"
                                    disabled={isUserLoading}
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={shippingAddress.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-[#1E1E1E] border border-gray-600 rounded text-white"
                                    disabled={isUserLoading}
                                />
                                <input
                                    type="text"
                                    name="street"
                                    placeholder="Street Address"
                                    value={shippingAddress.street}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-[#1E1E1E] border border-gray-600 rounded text-white"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={shippingAddress.city}
                                        onChange={handleInputChange}
                                        className="p-3 bg-[#1E1E1E] border border-gray-600 rounded text-white"
                                    />
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={shippingAddress.state}
                                        onChange={handleInputChange}
                                        className="p-3 bg-[#1E1E1E] border border-gray-600 rounded text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="postalCode"
                                        placeholder="Postal Code"
                                        value={shippingAddress.postalCode}
                                        onChange={handleInputChange}
                                        className="p-3 bg-[#1E1E1E] border border-gray-600 rounded text-white"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="form-checkbox" />
                                    <label>Billing address same as shipping</label>
                                </div>
                                <button
                                    onClick={handleNextStep}
                                    className="bg-[#FF4500] text-white px-6 py-2 rounded hover:bg-orange-600"
                                    disabled={isUserLoading || isCartLoading}
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
                                <label className="flex items-start gap-3 p-4 border rounded bg-[#1E1E1E] border-gray-600 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => {
                                            console.log('Selected payment method: COD');
                                            setPaymentMethod('cod');
                                        }}
                                    />
                                    <div>
                                        <p className="font-semibold">Cash on Delivery (COD)</p>
                                        <p className="text-sm text-gray-400">Pay with cash upon delivery at your doorstep.</p>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 p-4 border rounded bg-[#1E1E1E] border-gray-600 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Stripe"
                                        checked={paymentMethod === 'Stripe'}
                                        onChange={() => {
                                            console.log('Selected payment method: Stripe');
                                            setPaymentMethod('Stripe');
                                        }}
                                    />
                                    <div>
                                        <p className="font-semibold">Stripe</p>
                                        <p className="text-sm text-gray-400">Pay securely using your credit or debit card via Stripe.</p>
                                    </div>
                                </label>
                                <button
                                    onClick={handlePlaceOrder}
                                    className={`bg-[#FF4500] w-[200px] text-white px-6 py-2 rounded hover:bg-orange-600 ${isProcessing.current ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isProcessing.current}
                                >
                                    {paymentMethod === 'Stripe' ? 'Next' : 'Place Order'}
                                </button>
                            </div>
                        )}

                        {step === 2.5 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold mb-4">Complete Payment with Stripe</h2>
                                <StripePaymentWrapper
                                    orderId={createdOrderId}
                                    products={products}
                                    totalAmount={total}
                                    shippingAddress={shippingAddress}
                                    paymentMethod={paymentMethod}
                                    customerId={customerId}
                                    setStep={setStep}
                                    clearCart={clearCart.mutate}
                                />
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 text-center">
                                <div className="bg-[#1E1E1E] p-6 rounded mt-6 text-left space-y-4">
                                    <h2 className="text-2xl font-semibold text-white text-center">Thank you! Your order has been placed.</h2>
                                    {/* <p className="text-gray-400 text-center">We’ve sent a confirmation email to {shippingAddress.email || 'your email'}</p> */}
                                    <hr className="border-gray-600" />
                                    <p>
                                        <strong>Order ID:</strong> {createOrder?.data?.data?._id || createdOrderId || '#123456'}
                                    </p>
                                    <p>
                                        <strong>Date:</strong> {new Date().toISOString().split('T')[0]}
                                    </p>
                                    <p>
                                        <strong>Shipping Address:</strong> {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.postalCode}
                                    </p>
                                    <p>
                                        <strong>Payment Method:</strong> {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Stripe'}
                                    </p>
                                </div>
                                <div className="mt-6 flex justify-center gap-4">
                                    <button
                                        onClick={() => {
                                            console.log('Navigating to shop');
                                            navigate('/shop');
                                        }}
                                        className="bg-[#FF4500] text-white px-6 py-2 rounded hover:bg-orange-600"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden md:block mt-14">{orderSummary}</div>
                </div>
            </div>
            <ToastContainer hideProgressBar theme="dark" position="top-right" autoClose={4000} limit={1} />
            <Footer />
        </>
    );
}