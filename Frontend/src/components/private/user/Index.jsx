import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS for confirmAlert
import { FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Import toast

const fetchCustomers = async () => {
    try {
        const token = localStorage.getItem("token"); // Get token from localStorage

        const response = await axios.get("http://localhost:3000/api/v1/auth/getCustomers", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error("Failed to fetch customers");
        }
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
};

const User = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');

    // Fetch customers using react-query
    const { data: customers, isLoading, isError } = useQuery({
        queryKey: ['CUSTOMERS'],
        queryFn: fetchCustomers
    });

    // Filter customers based on search input
    const filteredCustomers = customers
        ? customers.filter(customer =>
            `${customer.fname} ${customer.lname}`.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    // Delete customer mutation
    const deleteMutation = useMutation({
        mutationFn: async (customerId) => {
            await axios.delete(`http://localhost:3000/api/v1/auth/${customerId}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
        },
        onSuccess: () => {
            toast.success('Customer deleted successfully.');
            queryClient.invalidateQueries(['CUSTOMERS']); // Refetch customers
        },
        onError: () => {
            toast.error('Failed to delete customer');
        },
    });

    // Handle delete with confirmation
    const handleDelete = (customerId) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this customer?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteMutation.mutate(customerId),
                },
                {
                    label: 'No',
                },
            ],
        });
    };


    if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
    if (isError) return <p className="text-center text-red-500">Error fetching customers.</p>;

    return (
        <div className="max-w-7xl mx-auto p-3">
            <h2 className="text-xl font-medium text-center text-black mb-8 flex items-center space-x-2">
                <FaUser className="text-black" />
                <span>User Details ({filteredCustomers?.length || 0})</span>
            </h2>

            {/* Search input */}


            {/* Table */}
            <table className="min-w-full text-black bg-white rounded-lg shadow-md overflow-hidden">
                <thead className="bg-gray-200 text-center text-black">
                    <tr>
                        <th className="py-2 px-4 text-center">Name</th>
                        <th className="py-2 px-4 text-center">Email</th>
                        <th className="py-2 px-4 text-center">Phone</th>
                        <th className="py-2 px-4 text-center">Role</th>
                        {/* <th className="py-3 px-4 text-center">Action</th> */}

                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                            <tr key={customer._id} className="border-b text-[15px] text-black text-center hover:bg-gray-50">
                                <td className="py-2 px-4 space-x-2">

                                    {`${customer.fname} ${customer.lname}`}
                                </td>
                                <td className="py-2 px-4">{customer.email}</td>
                                <td className="py-2 px-4">{customer.phone}</td>
                                <td className="py-2 px-4">{customer.role}</td>
                                {/* <td className="py-3 px-4">
                                    <div className="flex justify-center gap-4">
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => handleDelete(customer._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td> */}

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-2 px-4 text-center">No customers found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default User;