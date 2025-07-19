import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddSubcategory = () => {
    const [subcategory, setSubcategory] = useState({
        name: '',
        description: '',
        category: ''
    });

    const [errors, setErrors] = useState({});

    // Fetch categories for dropdown
    const { data: categoriesData } = useQuery({
        queryKey: ['all-categories'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/api/v1/category/getCategories', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            return res.data?.data || [];
        }
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubcategory({ ...subcategory, [name]: value });
        setErrors({ ...errors, [name]: '' }); // clear error
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};
        if (!subcategory.name.trim()) newErrors.name = 'Please enter subcategory name.';
        if (!subcategory.description.trim()) newErrors.description = 'Please enter description.';
        if (!subcategory.category.trim()) newErrors.category = 'Please select a category.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Mutation to create subcategory
    const createSubcategoryMutation = useMutation({
        mutationKey: ['CREATE_SUBCATEGORY'],
        mutationFn: async () => {
            return axios.post('http://localhost:3000/api/v1/subcategory/createSubcategory', subcategory, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
        },
        onSuccess: () => {
            toast.success('Subcategory added successfully.', {
                autoClose: 3000,
                hideProgressBar: true,
                theme: 'light'
            });
            setSubcategory({ name: '', description: '', category: '' });
        },
        onError: (err) => {
            const message = err.response?.data?.message || 'Failed to create subcategory.';
            toast.error(message, {
                autoClose: 3000,
                hideProgressBar: true,
                theme: 'light'
            });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        createSubcategoryMutation.mutate();
    };

    return (
        <div className="p-3 bg-white rounded-lg z-[1000]">
            <h2 className="text-xl text-black font-medium flex items-center mb-4">
                <FaPlus className="mr-2" /> Add New Subcategory
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-black mb-2">Subcategory Name</label>
                    <input
                        type="text"
                        name="name"
                        value={subcategory.name}
                        onChange={handleChange}
                        className="border border-gray-400 rounded-lg p-2 w-full text-black"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-black mb-2">Description</label>
                    <textarea
                        name="description"
                        value={subcategory.description}
                        onChange={handleChange}
                        className="border border-gray-400 rounded-lg p-2 w-full text-black"
                    />
                    {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Category Dropdown */}
                <div>
                    <label className="block text-black mb-2">Category</label>
                    <select
                        name="category"
                        value={subcategory.category}
                        onChange={handleChange}
                        className="border border-gray-400 rounded-lg p-2 w-full text-black"
                    >
                        <option value="">-- Select Category --</option>
                        {categoriesData?.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-[#FF4500] text-white px-4 py-2 rounded"
                    disabled={createSubcategoryMutation.isLoading}
                >
                    {createSubcategoryMutation.isLoading ? "Adding..." : "Add Subcategory"}
                </button>
            </form>
            <ToastContainer theme="light" hideProgressBar />
        </div>
    );
};

export default AddSubcategory;
