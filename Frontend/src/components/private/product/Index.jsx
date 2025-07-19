import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaSearch, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllProducts = () => {
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Fetch all products
    const { data, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/api/v1/product', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            return res.data;
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (productId) => {
            await axios.delete(`http://localhost:3000/api/v1/product/${productId}`, {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
            });
        },
        onSuccess: () => {
            toast.success('Product deleted successfully.', { autoClose: 3000, hideProgressBar: true });
            queryClient.invalidateQueries(['products']);
        },
        onError: () => {
            toast.error('Failed to delete product.');
        }
    });

    // Confirm delete
    const handleDelete = (id) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this product?',
            buttons: [
                { label: 'Yes', onClick: () => deleteMutation.mutate(id) },
                { label: 'No' }
            ],
        });
    };

    const filteredProducts = data?.data?.filter(prod =>
        prod.name.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading products.</div>;

    return (
        <div className="p-4 bg-white rounded-lg">
            <ToastContainer />
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-black">Products ({filteredProducts?.length || 0})</h2>

                <div className="relative w-96">
                    <input
                        type="text"
                        placeholder="Search Product..."
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
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Images</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Subcategory</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Quantity</th>
                        <th className="py-3 px-4">Brand</th>
                        <th className="py-3 px-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts?.map((prod, index) => (
                        <tr key={prod._id} className="text-center text-[15px] hover:bg-gray-50 text-black">
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4">{prod.name}</td>
                            <td className="py-3 px-4">
                                <div className="flex gap-2 justify-center">
                                    {prod.image?.slice(0, 2).map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={`http://localhost:3000/uploads/${img}`}
                                            alt={`Product ${idx}`}
                                            className="w-12 h-12 object-cover rounded border"
                                        />
                                    ))}
                                </div>
                            </td>
                            <td className="py-3 px-4">{prod.category?.name || 'N/A'}</td>
                            <td className="py-3 px-4">{prod.subcategory?.name || 'N/A'}</td>
                            <td className="py-3 px-4">Rs. {prod.price}</td>
                            <td className="py-3 px-4">{prod.quantity}</td>
                            <td className="py-3 px-4">{prod.brand?.name || 'N/A'}</td>

                            <td className="py-3 px-4">
                                <div className="flex justify-center gap-4">
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => handleDelete(prod._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredProducts?.length === 0 && (
                        <tr>
                            <td colSpan={6} className="py-4 text-center text-gray-500">
                                No products found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllProducts;
