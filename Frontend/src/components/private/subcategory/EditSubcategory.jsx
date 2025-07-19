import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditSubcategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subcategory, setSubcategory] = useState({
        name: "",
        description: "",
        category: "",
    });

    const [errors, setErrors] = useState({});

    // Fetch all categories for dropdown
    const { data: categoryData } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:3000/api/v1/category/getCategories", {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });
            return res.data;
        }
    });

    // Fetch subcategory details
    const { data, isLoading } = useQuery({
        queryKey: ["SUBCATEGORY_DETAILS", id],
        enabled: !!id,
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/subcategory/getSubcategory/${id}`);
            return res.data;
        }
    });

    useEffect(() => {
        if (data?.data) {
            setSubcategory({
                name: data.data.name || "",
                description: data.data.description || "",
                category: data.data.category?._id || data.data.category || "", // <--- IMPORTANT
            });
        }
    }, [data]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubcategory({ ...subcategory, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!subcategory.name.trim()) newErrors.name = "Subcategory name is required.";
        if (!subcategory.description.trim()) newErrors.description = "Description is required.";
        if (!subcategory.category) newErrors.category = "Please select a category.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Update subcategory mutation
    const updateSubcategoryMutation = useMutation({
        mutationFn: async (payload) => {
            return axios.put(
                `http://localhost:3000/api/v1/subcategory/updateSubcategory/${id}`,
                payload,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
        },
        onSuccess: () => {
            toast.success("Subcategory updated successfully.");
            setTimeout(() => navigate("/admin/subcategory/all-subcategories"), 2000);
        },
        onError: () => {
            toast.error("Failed to update subcategory.");
        }
    });

    // Submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        updateSubcategoryMutation.mutate(subcategory);
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="p-4 bg-white rounded-lg">
            <h2 className="text-xl text-black font-semibold flex items-center mb-4">
                <FaEdit className="mr-2" /> Edit Subcategory
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
                    ></textarea>
                    {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Category Select */}
                <div>
                    <label className="block text-black mb-2">Category</label>
                    <select
                        name="category"
                        value={subcategory.category}
                        onChange={handleChange}
                        className="border border-gray-400 rounded-lg p-2 w-full text-black"
                    >
                        <option value="">-- Select Category --</option>
                        {categoryData?.data?.map((cat) => (
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
                    disabled={updateSubcategoryMutation.isLoading}
                >
                    {updateSubcategoryMutation.isLoading ? (
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
                        "Update Subcategory"
                    )}
                </button>
            </form>
            <ToastContainer theme="light" hideProgressBar />
        </div>
    );
};

export default EditSubcategory;
