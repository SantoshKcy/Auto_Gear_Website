// EditProduct.jsx
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const materialOptions = [
        { value: 'Cotton', label: 'Cotton' },
        { value: 'Leather', label: 'Leather' },
        { value: 'Rubber', label: 'Rubber' },
        { value: 'Metal', label: 'Metal' },
        { value: 'Wood', label: 'Wood' },
        { value: 'Plastic', label: 'Plastic' },
        { value: 'Polyester', label: 'Polyester' },
    ];

    const colorsList = [
        { value: 'Red', label: 'Red', color: '#f44336' },
        { value: 'Green', label: 'Green', color: '#4caf50' },
        { value: 'Blue', label: 'Blue', color: '#2196f3' },
        { value: 'Black', label: 'Black', color: '#000000' },
        { value: 'White', label: 'White', color: '#ffffff' },
    ];

    const customColorOption = ({ data, innerRef, innerProps }) => (
        <div ref={innerRef} {...innerProps} className="flex items-center gap-2 p-2">
            <span style={{ backgroundColor: data.color }} className="w-4 h-4 rounded-full border" />
            {data.label}
        </div>
    );

    const [product, setProduct] = useState({
        name: '',
        description: '',
        category: '',
        subcategory: '',
        materials: [],
        colors: [],
        dimensions: [],
        price: '',
        brand: '',
        warranty: '',
        tags: [],
        images: [],
    });

    const [dimensions, setDimensions] = useState([{ length: '', width: '', height: '' }]);
    const [errors, setErrors] = useState({});

    // Fetch categories, subcategories, brands
    const { data: categories = [] } = useQuery({
        queryKey: ['all-categories'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/api/v1/category/getCategories', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            return res.data?.data || [];
        }
    });


    const { data: subcategories = [] } = useQuery({
        queryKey: ['all-subcategories'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/api/v1/subcategory/getSubcategories', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            return res.data?.data || [];
        }
    });

    const { data: brands = [] } = useQuery({
        queryKey: ['all-brands'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/api/v1/brand/getBrands', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            return res.data?.data || [];
        }
    });

    const { data: productData } = useQuery({
        queryKey: ['product-details', id],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/product/getProduct/${id}`);
            return res.data?.data;
        },
        enabled: !!id,
        onSuccess: (fetched) => {
            setProduct({
                ...fetched,
                materials: fetched.materials || [],
                colors: fetched.colors || [],
                tags: fetched.tags || [],
                images: [],
            });
            setDimensions((fetched.dimensions || []).map(dim => {
                const [length, width, height] = dim.split('x');
                return { length, width, height };
            }));
        }
    });



    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            setProduct((prev) => {
                const newTags = checked
                    ? [...prev.tags, value]
                    : prev.tags.filter((tag) => tag !== value);
                return { ...prev, tags: newTags };
            });
        } else if (type === 'file') {
            setProduct((prev) => ({ ...prev, images: Array.from(files) }));
        } else {
            setProduct((prev) => ({ ...prev, [name]: value }));
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!product.name.trim()) newErrors.name = 'Product name required.';
        if (!product.description.trim()) newErrors.description = 'Description required.';
        if (!product.category) newErrors.category = 'Category required.';
        if (!product.subcategory) newErrors.subcategory = 'Subcategory required.';
        if (!product.brand) newErrors.brand = 'Brand required.';
        if (!product.price) newErrors.price = 'Price required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateProductMutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            Object.entries(product).forEach(([key, value]) => {
                if (key === 'images') {
                    value.forEach((file) => formData.append('images', file));
                } else if (['materials', 'colors', 'tags'].includes(key)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });
            const dimensionArray = dimensions.map(d => `${d.length}x${d.width}x${d.height}`);
            formData.append('dimensions', JSON.stringify(dimensionArray));
            return axios.put(`http://localhost:3000/api/v1/product/${id}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
        onSuccess: () => {
            toast.success('Product updated successfully.');
            setTimeout(() => navigate('/admin/product/all-products'), 2000);
        },
        onError: () => toast.error('Failed to update product'),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        updateProductMutation.mutate();
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen text-black">
            <h1 className="font-semibold text-black gap-2 text-xl font-bold mb-6">Edit Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">1. Basic Product Information</h2>
                    <div className="grid gap-4">
                        <input name="name" value={product.name} onChange={handleChange} placeholder="Product Name" className="border border-gray-300 p-3 rounded placeholder-black" />
                        <textarea name="description" value={product.description} onChange={handleChange} placeholder="Short Description" className="border border-gray-300 p-3 rounded h-24 placeholder-black" />
                    </div>
                </div>

                <div className="bg-white rounded shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">3. Category & Subcategory</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <select name="category" value={product.category} onChange={handleChange} className="border border-gray-300 p-3 rounded">
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                        </select>
                        <select name="subcategory" value={product.subcategory} onChange={handleChange} className="border border-gray-300 p-3 rounded">
                            <option value="">Select Subcategory</option>
                            {subcategories.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">4. Product Variants & Options</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Select
                            isMulti
                            name="materials"
                            options={materialOptions}
                            value={product.materials.map(m => ({ value: m, label: m }))}
                            onChange={(selected) =>
                                setProduct(prev => ({
                                    ...prev,
                                    materials: selected.map(opt => opt.value)
                                }))
                            }
                            isCreatable
                            placeholder="Select or type materials"
                            classNamePrefix="select"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    minHeight: '35px',
                                    padding: '8px',
                                    fontSize: '16px'
                                }),
                                valueContainer: (provided) => ({
                                    ...provided,
                                    padding: '0 8px'
                                }),
                                placeholder: (provided) => ({
                                    ...provided,
                                    color: 'black' // set placeholder text color to black
                                })
                            }}
                        />




                        <Select
                            isMulti
                            name="colors"
                            options={colorsList}
                            value={colorsList.filter(opt => product.colors.includes(opt.value))}
                            onChange={(selected) =>
                                setProduct(prev => ({
                                    ...prev,
                                    colors: selected.map(opt => opt.value)
                                }))
                            }
                            getOptionLabel={(e) => customColorOption({ data: e })}
                            className="basic-multi-select text-black"
                            classNamePrefix="select"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    minHeight: '35px',       // increase the height
                                    padding: '8px',          // optional: add inner padding
                                    fontSize: '16px'         // optional: make text a bit bigger
                                }),
                                valueContainer: (provided) => ({
                                    ...provided,
                                    padding: '0 8px'
                                }),
                                placeholder: (provided) => ({
                                    ...provided,
                                    color: 'black' // set placeholder text color to black
                                })
                            }}
                        />

                        {dimensions.map((dim, index) => (
                            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                                <input
                                    type="text"
                                    value={dim.length}
                                    onChange={(e) =>
                                        setDimensions((prev) => {
                                            const updated = [...prev];
                                            updated[index].length = e.target.value;
                                            return updated;
                                        })
                                    }
                                    placeholder="Length (cm)"
                                    className="border border-gray-300 p-3 placeholder-black rounded"
                                />
                                <input
                                    type="text"
                                    value={dim.width}
                                    onChange={(e) =>
                                        setDimensions((prev) => {
                                            const updated = [...prev];
                                            updated[index].width = e.target.value;
                                            return updated;
                                        })
                                    }
                                    placeholder="Width (cm)"
                                    className="border border-gray-300 p-3 rounded placeholder-black"
                                />
                                <input
                                    type="text"
                                    value={dim.height}
                                    onChange={(e) =>
                                        setDimensions((prev) => {
                                            const updated = [...prev];
                                            updated[index].height = e.target.value;
                                            return updated;
                                        })
                                    }
                                    placeholder="Height (cm)"
                                    className="border border-gray-300 p-3 placeholder-black  rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDimensions((prev) => prev.filter((_, i) => i !== index));
                                    }}
                                    className="text-red-500 text-sm mt-2 col-span-3"
                                >

                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() =>
                                setDimensions((prev) => [...prev, { length: '', width: '', height: '' }])
                            }
                            className="text-blue-600 text-sm mt-2"
                        >
                            + Add Dimension
                        </button>


                    </div>
                </div>

                <div className="bg-white rounded shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">5. Inventory & Pricing</h2>
                    <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" className="border border-gray-300 p-3 placeholder-black rounded w-full md:w-1/2" />
                </div>

                <div className="bg-white rounded shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">6. Brand & Warranty</h2>
                    <div className="grid gap-4">
                        <select name="brand" value={product.brand} onChange={handleChange} className="border border-gray-300 p-3 text-black rounded w-full md:w-1/2">
                            <option value="">Select Brand</option>
                            {brands.map(brand => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
                        </select>
                        <textarea name="warranty" value={product.warranty} onChange={handleChange} placeholder="Warranty Info" className="border border-gray-300 p-3 placeholder-black rounded h-20" />
                    </div>
                </div>

                <div className="bg-white rounded shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">7. Product Media</h2>
                    <div className="flex flex-wrap gap-4">
                        {product.images.map((file, index) => (
                            <div key={index} className="relative w-32 h-32 border border-gray-300 rounded overflow-hidden">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updatedImages = product.images.filter((_, i) => i !== index);
                                        setProduct((prev) => ({ ...prev, images: updatedImages }));
                                    }}
                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}

                        {/* Add Image Upload Button */}
                        <div className="w-32 h-32 border-2 border-dashed border-gray-400 rounded flex items-center justify-center cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setProduct((prev) => ({
                                            ...prev,
                                            images: [...prev.images, file]
                                        }));
                                    }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <span className="text-3xl text-gray-400">+</span>
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">8. Tags</h2>
                    <div>
                        {['Featured', 'Trending', 'Best Seller'].map((tag) => (
                            <div className="mb-2" key={tag}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={tag}
                                        checked={product.tags.includes(tag)}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    {tag}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-[#FF4500] text-white px-4 py-2 rounded"
                    disabled={updateProductMutation.isLoading}
                >
                    {updateProductMutation.isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                            Updating...
                        </span>
                    ) : (
                        "Update Product"
                    )}
                </button>
            </form>

            <ToastContainer hideProgressBar />
        </div>
    );
} 