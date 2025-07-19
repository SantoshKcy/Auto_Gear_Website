import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Footer from '../common/customer/Footer';
import Navbar from '../common/customer/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import { useQueryClient } from '@tanstack/react-query';

const customerId = localStorage.getItem('userId');

export default function ProductDetails() {
    const queryClient = useQueryClient();
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeImage, setActiveImage] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedDimension, setSelectedDimension] = useState('');
    const isProcessing = useRef(false);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/product/${id}`);
            return res.data?.data;
        },
    });

    const imageList = product?.image || [];
    const previewImage = activeImage || imageList[0];

    const getStockStatus = (quantity) => {
        if (quantity === 0) {
            return { text: 'Out of Stock', bg: 'bg-[#FFFFFF1A]', textColor: 'text-red-500' };
        } else if (quantity <= 10 && quantity > 0) {
            return { text: 'Low on Stock', bg: 'bg-[#FFFFFF1A]', textColor: 'text-yellow-300' };
        } else {
            return { text: 'In Stock', bg: 'bg-[#FFFFFF1A]', textColor: 'text-green-500' };
        }
    };

    useEffect(() => {
        if (!customerId || !product) return;
        axios.get(`http://localhost:3000/api/v1/wishlist/check/${product._id}`, {
            params: { customerId }
        })
            .then((res) => setIsWishlisted(res.data.isWishlisted))
            .catch((err) => console.error("Wishlist check failed", err));
    }, [product]);

    const toggleWishlist = async () => {
        if (!customerId) {
            toast.dismiss();
            toast.error("Please log in to manage your wishlist.");
            return;
        }

        if (isProcessing.current) return;
        isProcessing.current = true;

        try {
            if (isWishlisted) {
                await axios.delete(`http://localhost:3000/api/v1/wishlist/remove/${product._id}`, {
                    params: { customerId }
                });
                toast.dismiss();
                toast.info("Product removed from wishlist.");
            } else {
                await axios.post(`http://localhost:3000/api/v1/wishlist/add`, {
                    customerId,
                    productId: product._id
                });
                toast.dismiss();
                toast.success("Product added to wishlist.");
            }
            queryClient.invalidateQueries(["wishlistCount", customerId]);
            setIsWishlisted((prev) => !prev);
        } catch (err) {
            console.error("Toggle failed", err);
            toast.dismiss();
            toast.error("Could not update wishlist.");
        } finally {
            isProcessing.current = false;
        }
    };

    const handleQuantityChange = (type) => {
        if (!product || isProcessing.current) return;

        isProcessing.current = true;
        setQuantity((prev) => {
            if (type === "increase") {
                if (prev >= product.quantity) {
                    toast.dismiss();
                    toast.error(`Cannot add more. Only ${product.quantity} items in stock.`);
                    isProcessing.current = false;
                    return prev;
                }
                isProcessing.current = false;
                return prev + 1;
            }
            if (type === "デecrease" && prev > 1) {
                isProcessing.current = false;
                return prev - 1;
            }
            isProcessing.current = false;
            return prev;
        });
    };

    const addToCart = async () => {
        if (!customerId) {
            toast.dismiss();
            toast.error("Please log in first!");
            return;
        }

        if (product.quantity === 0) {
            toast.dismiss();
            toast.error("Cannot add to cart. Product is out of stock.");
            return;
        }

        if (isProcessing.current) return;
        isProcessing.current = true;

        try {
            await axios.post("http://localhost:3000/api/v1/cart/", {
                customerId,
                productId: product._id,
                quantity,
                selectedVariant: {
                    material: selectedMaterial,
                    color: selectedColor,
                    dimensions: selectedDimension,
                },
            });
            toast.dismiss();
            toast.success("Product added to cart!");
            queryClient.invalidateQueries(["cartCount", customerId]);
        } catch (error) {
            console.error("Error adding to cart", error);
            toast.dismiss();
            toast.error("Please select variant options!");
        } finally {
            isProcessing.current = false;
        }
    };

    const handleBuyNow = () => {
        if (!customerId) {
            toast.dismiss();
            toast.error("Please log in first!");
            return;
        }
        if (product.quantity === 0) {
            toast.dismiss();
            toast.error("Cannot buy. Product is out of stock.");
            return;
        }
        if (isProcessing.current) return;
        isProcessing.current = true;

        const cartData = {
            products: [{
                productId: product,
                quantity,
                selectedVariant: {
                    material: selectedMaterial,
                    color: selectedColor,
                    dimensions: selectedDimension,
                }
            }]
        };
        navigate('/checkout', { state: { step: 1, cart: cartData } });
        isProcessing.current = false;
    };

    if (isLoading) return <div className="text-white p-10">Loading product...</div>;
    if (error) return <div className="text-red-500 p-10">Failed to load product.</div>;

    const { text, bg, textColor } = product ? getStockStatus(product.quantity) : { text: '', bg: '', textColor: '' };

    return (
        <>
            <Navbar />
            <div className="bg-[#101010] text-white px-6 md:px-10 py-10 font-rajdhani min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div className="relative sticky top-20 self-start">
                        <div className="relative w-full h-[400px] rounded overflow-hidden group">
                            <img
                                src={`http://localhost:3000/uploads/${previewImage}`}
                                alt={product.name}
                                className="w-full h-full object-cover rounded transition duration-300 group-hover:scale-105"
                            />
                            <button
                                onClick={toggleWishlist}
                                className={`absolute top-3 right-3 p-2 rounded-full transition ${isWishlisted ? 'bg-black text-[#FF000D]' : 'bg-black text-white hover:text-[#FF000D]'}`}
                            >
                                <FaHeart className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex space-x-2 mt-4">
                            {imageList.slice(0, 4).map((img, i) => (
                                <img
                                    key={i}
                                    onClick={() => setActiveImage(img)}
                                    src={`http://localhost:3000/uploads/${img}`}
                                    alt={`Thumbnail ${i + 1}`}
                                    className={`w-16 h-16 object-cover rounded border-2 cursor-pointer ${previewImage === img ? 'border-white' : 'border-gray-600'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold">{product.name}</h1>
                            {product.category?.name && (
                                <span className={`text-xs text-gray-300 ${bg} px-2 py-1 rounded whitespace-nowrap`}>
                                    {product.category.name}
                                </span>
                            )}
                        </div>
                        <p className="text-[#FF4500] text-2xl font-semibold">Rs. {product.price}</p>

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">Description</h3>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-300 text-[18px]">{product.description}</p>
                                <span className={`text-xs ${textColor} ${bg} px-2 py-1 rounded whitespace-nowrap`}>
                                    {text}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">Compatibility</h3>
                            {product.compatibilities && product.compatibilities.length > 0 ? (
                                product.compatibilities.map((compat, index) => (
                                    <p key={index} className="text-gray-300 text-[18px]">
                                        Compatible with: {compat.make?.name}, {compat.model?.name}, {compat.years.map(year => year.year).join(', ')}
                                    </p>
                                ))
                            ) : (
                                <p className="text-gray-400 text-[18px]">No compatibility information available.</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">Brand & Warranty</h3>
                            <p className="text-gray-300 text-[18px]">{product.brand?.name || 'No brand'}</p>
                            <p className="text-gray-300 text-[17px]">
                                Warranty: {product.warranty ? `${product.warranty} months` : 'No warranty'}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Variant</h3>

                            {product.variants.materials.length > 0 && (
                                <div>
                                    <h4 className="text-[17px] font-medium mb-1">Materials</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {product.variants.materials.map((mat, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedMaterial(mat)}
                                                className={`px-3 py-1 rounded ${selectedMaterial === mat ? 'bg-[#FF4500]' : 'bg-[#1E1E1E]'}`}
                                            >
                                                {mat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.variants.colors.length > 0 && (
                                <div>
                                    <h4 className="text-[17px] font-medium mb-1">Color Options</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {product.variants.colors.map((color, i) => (
                                            <div
                                                key={i}
                                                title={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-6 h-6 rounded-full border-2 cursor-pointer ${selectedColor === color ? 'border-[#FF4500]' : 'border-white'}`}
                                                style={{ backgroundColor: color.toLowerCase() }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.variants.dimensions.length > 0 && (
                                <div>
                                    <h4 className="text-[17px] font-medium mb-1">Dimensions</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {product.variants.dimensions.map((dim, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedDimension(dim)}
                                                className={`px-3 py-1 rounded ${selectedDimension === dim ? 'bg-[#FF4500]' : 'bg-[#1E1E1E]'}`}
                                            >
                                                {dim}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                    className={`bg-gray-200 text-gray-800 px-5 py-2 rounded-l-md hover:bg-gray-300 ${quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => handleQuantityChange("decrease")}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="w-12 h-10 flex items-center justify-center text-lg font-medium">{quantity}</span>
                                <button
                                    className={`bg-gray-200 text-gray-800 px-5 py-2 rounded-r-md hover:bg-gray-300 ${product && quantity >= product.quantity ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => handleQuantityChange("increase")}
                                    disabled={product && quantity >= product.quantity}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className={`bg-[#FF4500] text-white text-[17px] px-6 py-2 rounded-md ${product && product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={addToCart}
                                disabled={product && product.quantity === 0}
                            >
                                Add to Cart
                            </button>
                            <button
                                className={`bg-[#FF4500] text-white text-[17px] px-6 py-2 rounded-md ${product && product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleBuyNow}
                                disabled={product && product.quantity === 0}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer hideProgressBar theme="dark" position="top-right" autoClose={4000} />
            <Footer />
        </>
    );
}