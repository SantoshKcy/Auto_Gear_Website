import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditBrand = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [brand, setBrand] = useState({
        name: "",
        description: "",
    });

    // Fetch brand details
    const { data, isLoading, error } = useQuery({
        queryKey: ["BRAND_DETAILS", id],
        enabled: !!id,
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/brand/getBrand/${id}`);
            return res.data;
        },
        onError: (err) => {
            console.error("Error fetching brand:", err);
        }
    });

    useEffect(() => {
        if (data && data.data) {
            setBrand({
                name: data.data.name || "",
                description: data.data.description || "",
            });
        }
    }, [data]);

    // Update brand mutation
    const updateBrandMutation = useMutation({
        mutationKey: ["UPDATE_BRAND", id],
        mutationFn: async (updatedData) => {
            return axios.put(`http://localhost:3000/api/v1/brand/updateBrand/${id}`, updatedData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
        },
        onSuccess: () => {
            toast.success("Brand updated successfully.", { autoClose: 5000 });
            setTimeout(() => navigate("/admin/brand/all-brands"), 3000);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to update brand. Please try again.");
        },
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBrand({ ...brand, [name]: value });
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        updateBrandMutation.mutate(brand);
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="p-3 bg-white rounded-lg z-[1000]">
            <h2 className="text-xl text-black font-medium flex items-center mb-4">
                <FaEdit className="mr-2" /> Edit Brand
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
                        required
                        className="border border-gray-400 rounded-lg p-2 w-full text-black"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-black mb-2">Description</label>
                    <textarea
                        name="description"
                        value={brand.description}
                        onChange={handleChange}
                        required
                        className="border border-gray-400 rounded-lg p-2 w-full text-black"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-[#FF4500] text-white px-4 py-2 rounded"
                    disabled={updateBrandMutation.isLoading}
                >
                    {updateBrandMutation.isLoading ? "Updating..." : "Update Brand"}
                </button>
            </form>
            <ToastContainer theme="light" hideProgressBar />
        </div>
    );
};

export default EditBrand;
