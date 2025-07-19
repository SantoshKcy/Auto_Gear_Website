import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FeaturedCategories = () => {
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/api/v1/category/getCategories', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            return res.data?.data || [];
        },
    });

    if (isLoading) return <div className="text-white px-8 py-16">Loading categories...</div>;
    if (error) return <div className="text-red-500 px-8 py-16">Failed to load categories.</div>;

    return (
        <section className="bg-[#171717] text-white py-16 px-8">
            <h2 className="text-2xl font-semibold mb-8">Featured Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {data.map((category) => (
                    <div
                        key={category._id}
                        className="bg-[#101010] rounded-md overflow-hidden shadow p-4 text-center cursor-pointer hover:shadow-xl hover:scale-105 transform transition-transform duration-300 ease-in-out border"
                        onClick={() => navigate(`/shop?category=${category._id}`)}
                    >
                        <img
                            src={`http://localhost:3000/uploads/${category.image}`}
                            alt={category.name}
                            className="h-32 w-full object-cover rounded-md mb-3"
                        />
                        <h3 className="text-lg font-medium">{category.name}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedCategories;
