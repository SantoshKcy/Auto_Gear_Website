import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaEdit, FaSearch, FaTags, FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllBrand = () => {
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Fetch brands
    const { data, isLoading, error } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/api/v1/brand/getBrands', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            return res.data;
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (brandId) => {
            await axios.delete(`http://localhost:3000/api/v1/brand/deleteBrand/${brandId}`, {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
            });
        },
        onSuccess: () => {
            toast.success('Brand deleted successfully.', {
                autoClose: 3000,
                hideProgressBar: true,
            });
            queryClient.invalidateQueries(['brands']);
        },
        onError: () => {
            toast.error('Failed to delete brand.');
        }
    });

    // Confirm delete
    const handleDelete = (id) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this brand?',
            buttons: [
                { label: 'Yes', onClick: () => deleteMutation.mutate(id) },
                { label: 'No' }
            ],
        });
    };

    // Filter by name
    const filteredBrands = data?.data.filter(brand =>
        brand.name.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading brands.</div>;

    return (
        <div className="p-4 bg-white rounded-lg">
            <ToastContainer />
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-black flex items-center">
                    <FaTags className="mr-2" /> Brands ({filteredBrands?.length || 0})
                </h2>
                <div className="relative w-96">
                    <input
                        type="text"
                        placeholder="Search Brand..."
                        className="border text-black rounded-lg pl-10 pr-4 py-2 w-full"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
                </div>
            </div>

            <table className="min-w-full rounded overflow-hidden shadow-lg">
                <thead className="bg-gray-200 text-center text-black">
                    <tr>
                        <th className="py-3 px-4">SN</th>
                        <th className="py-3 px-4">Brand Name</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBrands?.map((brand, index) => (
                        <tr key={brand._id} className="text-[15px] text-black text-center hover:bg-gray-50">
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4">{brand.name}</td>
                            <td className="py-3 px-4">{brand.description}</td>
                            <td className="py-3 px-4">
                                <div className="flex justify-center gap-4">
                                    <button
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={() => navigate(`/admin/brand/edit-brand/${brand._id}`)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => handleDelete(brand._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredBrands?.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-4 text-center text-gray-500">
                                No brands found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllBrand;
