import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBrand = () => {
    const [brand, setBrand] = useState({
        name: '',
        description: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBrand({ ...brand, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error on change
    };

    const validateForm = () => {
        const newErrors = {};
        if (!brand.name.trim()) newErrors.name = 'Please enter brand name.';
        if (!brand.description.trim()) newErrors.description = 'Please enter description.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addBrandMutation = useMutation({
        mutationKey: ['ADD_BRAND'],
        mutationFn: async () => {
            return axios.post('http://localhost:3000/api/v1/brand/createBrand', brand, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
        },
        onSuccess: () => {
            toast.success('Brand added successfully.', {
                autoClose: 3000,
                hideProgressBar: true,
                theme: 'light'
            });
            setBrand({ name: '', description: '' });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || 'Failed to add brand. Please try again.';
            toast.error(msg, {
                autoClose: 3000,
                hideProgressBar: true,
                theme: 'light'
            });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        addBrandMutation.mutate();
    };

    return (
        <div className="p-3 bg-white rounded-lg z-[1000]">
            <h2 className="text-xl text-black font-medium flex items-center mb-4">
                <FaPlus className="mr-2" /> Add New Brand
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Brand Name */}
                <div>
                    <label className="block text-black mb-2">Brand Name</label>
                    <input
                        type="text"
                        name="name"
                        value={brand.name}
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
                        value={brand.description}
                        onChange={handleChange}
                        className="border border-gray-400 text-black rounded-lg p-2 w-full"
                    ></textarea>
                    {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-[#FF4500] text-white px-4 py-2 rounded"
                    disabled={addBrandMutation.isLoading}
                >
                    {addBrandMutation.isLoading ? 'Adding...' : 'Add Brand'}
                </button>
            </form>
            <ToastContainer theme="light" hideProgressBar />
        </div>
    );
};

export default AddBrand;
