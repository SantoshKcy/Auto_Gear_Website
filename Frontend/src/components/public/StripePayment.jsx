import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Load publishable key from Stripe
const stripePromise = loadStripe('pk_test_51Rj36I4CYapQbNJ7tHDHQotrP52b6bjDWYPAK2oWG3D6qV1KqTFe1KdR4vvOBNQj7YeTbuczIW6tkEjl9I9GjU7u006oU4VbKf');

function StripeForm({ products, totalAmount, shippingAddress, paymentMethod, customerId, setStep, clearCart }) {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Custom styles for CardElement to match dark theme
    const cardElementOptions = {
        style: {
            base: {
                color: '#ffffff',
                backgroundColor: '#1E1E1E',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '16px',
                '::placeholder': {
                    color: '#6B7280',
                },
                border: '1px solid #4B5563',
                borderRadius: '4px',
            },
            invalid: {
                color: '#EF4444',
                iconColor: '#EF4444',
            },
        },
    };

    useEffect(() => {
        const createIntent = async () => {
            try {
                console.log('Creating payment intent with totalAmount:', totalAmount, 'customerId:', customerId);
                const res = await axios.post('http://localhost:3000/api/v1/stripe/create-payment-intent', {
                    amount: totalAmount,
                    customerId,
                });
                console.log('Payment intent response:', res.data);
                setClientSecret(res.data.clientSecret);
            } catch (error) {
                console.error('Failed to create payment intent:', error.message, error.stack);
                setErrorMessage(`Failed to initialize payment: ${error.message}`);
                toast.error(`Failed to initialize payment: ${error.message}`);
            }
        };

        if (products?.length && totalAmount > 0 && customerId) {
            console.log('Valid data for payment intent:', { products, totalAmount, customerId });
            createIntent();
        } else {
            console.error('Missing required data for payment intent:', { products, totalAmount, customerId });
            setErrorMessage('Invalid order data. Please try again.');
            toast.error('Invalid order data. Please try again.');
        }
    }, [products, totalAmount, customerId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit called, isProcessing:', isProcessing);

        if (!stripe || !elements || isProcessing || !clientSecret) {
            console.warn('Cannot submit: stripe, elements, or clientSecret missing, or payment is processing', {
                stripe: !!stripe,
                elements: !!elements,
                clientSecret: !!clientSecret,
                isProcessing,
            });
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const cardElement = elements.getElement(CardElement);
            console.log('Initiating confirmCardPayment for clientSecret:', clientSecret);

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (result.error) {
                console.error('Payment failed:', result.error.message);
                setErrorMessage(result.error.message);
                toast.error(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded:', result.paymentIntent);
                try {
                    console.log('Creating order with data:', {
                        customerId,
                        products,
                        totalAmount,
                        paymentMethod,
                        shippingAddress,
                        paymentStatus: 'Paid',
                        isPaid: true,
                    });
                    const orderRes = await axios.post('http://localhost:3000/api/v1/order', {
                        customerId,
                        products,
                        totalAmount,
                        paymentMethod,
                        shippingAddress,
                        paymentStatus: 'Paid',
                        isPaid: true,
                    });
                    console.log('Order created successfully:', orderRes.data);
                    toast.success('Order placed successfully!');
                    clearCart();
                    setStep(3);
                } catch (orderError) {
                    console.error('Order creation failed after payment:', orderError.message, orderError.stack);
                    setErrorMessage(`Payment succeeded but order creation failed: ${orderError.message}`);
                    toast.error(`Payment succeeded but order creation failed: ${orderError.message}`);
                }
            }
        } catch (error) {
            console.error('Error in confirmCardPayment:', error.message, error.stack);
            setErrorMessage(`Payment error: ${error.message}`);
            toast.error(`Payment error: ${error.message}`);
        } finally {
            setIsProcessing(false);
            console.log('Payment processing completed, isProcessing set to false');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-[#1E1E1E] rounded border border-gray-600">
                <CardElement options={cardElementOptions} />
            </div>
            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
            <button
                type="submit"
                className={`bg-[#FF4500] w-[200px] text-white px-6 py-2 rounded hover:bg-orange-600 ${
                    isProcessing || !stripe || !clientSecret ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isProcessing || !stripe || !clientSecret}
            >
                {isProcessing ? 'Processing...' : 'Pay'}
            </button>
        </form>
    );
}

export default function StripePaymentWrapper({ products, totalAmount, shippingAddress, paymentMethod, customerId, setStep, clearCart }) {
    return (
        <Elements stripe={stripePromise}>
            <StripeForm
                products={products}
                totalAmount={totalAmount}
                shippingAddress={shippingAddress}
                paymentMethod={paymentMethod}
                customerId={customerId}
                setStep={setStep}
                clearCart={clearCart}
            />
        </Elements>
    );
}