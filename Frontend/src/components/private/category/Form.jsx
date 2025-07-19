import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategory = () => {
    const [category, setCategory] = useState({
        name: '',
        description: '',
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error on change
    };

    // Handle image selection and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCategory({ ...category, image: file });
            setImagePreview(URL.createObjectURL(file));
            setErrors({ ...errors, image: '' }); // Clear error
        }
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};
        if (!category.name.trim()) newErrors.name = 'Please enter category name.';
        if (!category.description.trim()) newErrors.description = 'Please enter description.';
        if (!category.image) newErrors.image = 'Please upload an image.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // React Query mutation for adding category
    const addCategoryMutation = useMutation({
        mutationKey: ['ADD_CATEGORY'],
        mutationFn: async (formData) => {
            return axios.post('http://localhost:3000/api/v1/category/createCategory', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
        },
        onSuccess: () => {
            toast.success('Category added successfully.', {
                autoClose: 3000,
                hideProgressBar: true,
                theme: 'light'
            });
            setCategory({ name: '', description: '', image: null });
            setImagePreview(null);
            document.getElementById("imageInput").value = "";
        },
        onError: (error) => {
            toast.error('Failed to add category. Please try again.', {
                autoClose: 3000,
                hideProgressBar: true,
                theme: 'light'
            });
        }
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('name', category.name);
        formData.append('description', category.description);
        formData.append('categoryImage', category.image);

        addCategoryMutation.mutate(formData);
    };

    return (
        <div className="p-3 bg-white rounded-lg z-[1000]">
            <h2 className="text-xl text-black font-medium flex items-center mb-4">
                <FaPlus className="mr-2" /> Add New Category
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Name */}
                <div>
                    <label className="block text-black mb-2">Category Name</label>
                    <input
                        type="text"
                        name="name"
                        value={category.name}
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
                        value={category.description}
                        onChange={handleChange}
                        className="border border-gray-400 text-black rounded-lg p-2 w-full text-black"
                    ></textarea>
                    {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-black mb-2">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border border-gray-400 rounded-lg p-2 w-full"
                        id="imageInput"
                    />
                    {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-gray-600">Image Preview:</p>
                            <img
                                src={imagePreview}
                                alt="Selected"
                                className="mt-2 w-40 h-40 object-cover rounded-lg border"
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-[#FF4500] text-white px-4 py-2 rounded"
                    disabled={addCategoryMutation.isLoading}
                >
                    {addCategoryMutation.isLoading ? 'Adding...' : 'Add Category'}
                </button>
            </form>
            <ToastContainer theme="light" hideProgressBar />
        </div>
    );
};

export default AddCategory;
