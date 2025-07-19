import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../common/customer/Navbar';
import Footer from '../common/customer/Footer';
import ProductUI from '../common/customer/ProductUI';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash/debounce'; // Import lodash debounce for search input

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        make: '',
        model: '',
        year: '',
        categories: [],
        brands: [],
        sort: '',
        search: '', // Add search to filters state
    });
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [years, setYears] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();

    // Handle category from URL
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setFilters((prev) => ({
                ...prev,
                categories: [categoryFromUrl],
            }));
        }
    }, [searchParams]);

    // Fetch makes, categories, brands on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [makeRes, categoryRes, brandRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/v1/make/getMakes'),
                    axios.get('http://localhost:3000/api/v1/category/getCategories'),
                    axios.get('http://localhost:3000/api/v1/brand/getBrands'),
                ]);

                setMakes(makeRes.data.data || []);
                setCategories(categoryRes.data.data || []);
                setBrands(brandRes.data.data || []);
            } catch (err) {
                console.error('Error loading filter options:', err);
            }
        };

        fetchInitialData();
    }, []);

    // Load models when make changes
    useEffect(() => {
        if (filters.make) {
            axios
                .get(`http://localhost:3000/api/v1/model/by-make/${filters.make}`)
                .then((res) => setModels(res.data.data || []))
                .catch((err) => console.error('Error loading models:', err));
        } else {
            setModels([]);
        }

        setFilters((prev) => ({ ...prev, model: '', year: '' }));
        setYears([]);
    }, [filters.make]);

    // Load years when model changes
    useEffect(() => {
        if (filters.model) {
            axios
                .get(`http://localhost:3000/api/v1/year/getYearsByModel/${filters.model}`)
                .then((res) => setYears(res.data.data || []))
                .catch((err) => console.error('Error loading years:', err));
        } else {
            setYears([]);
        }

        setFilters((prev) => ({ ...prev, year: '' }));
    }, [filters.model]);

    // Fetch products when filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const isFiltersEmpty =
                    !filters.make &&
                    !filters.model &&
                    !filters.year &&
                    filters.categories.length === 0 &&
                    filters.brands.length === 0 &&
                    !filters.sort &&
                    !filters.search; // Include search in empty check

                let res;

                if (isFiltersEmpty) {
                    // Load all products
                    res = await axios.get('http://localhost:3000/api/v1/product');
                    setProducts(res.data?.data || []);
                } else {
                    // Load filtered products
                    const query = new URLSearchParams();

                    if (filters.make) query.append('make', filters.make);
                    if (filters.model) query.append('model', filters.model);
                    if (filters.year) query.append('year', filters.year);
                    if (filters.search) query.append('search', filters.search); // Add search to query
                    filters.categories.forEach((c) => query.append('categories', c));
                    filters.brands.forEach((b) => query.append('brands', b));
                    if (filters.sort) query.append('sort', filters.sort);

                    res = await axios.get(`http://localhost:3000/api/v1/product/filter?${query.toString()}`);
                    setProducts(res.data?.products || []);
                }
            } catch (err) {
                console.error('Error fetching products:', err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters]);

    // Handle search input with debouncing
    const handleSearchChange = debounce((value) => {
        setFilters((prev) => ({ ...prev, search: value }));
    }, 500);

    const handleCheckboxChange = (type, value) => {
        setFilters((prev) => {
            const updated = new Set(prev[type]);
            updated.has(value) ? updated.delete(value) : updated.add(value);
            return { ...prev, [type]: Array.from(updated) };
        });
    };

    const handleClearFilters = () => {
        setFilters({
            make: '',
            model: '',
            year: '',
            categories: [],
            brands: [],
            sort: '',
            search: '', // Clear search term
        });
        setModels([]);
        setYears([]);
    };

    return (
        <>
            <Navbar />
            <div className="bg-[#101010] text-white font-rajdhani px-6 md:px-10 py-8 min-h-screen">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold mb-1">Shop Parts & Accessories</h1>
                    <nav className="text-sm text-[#E0E0E0]">
                        <Link to="/" className="hover:underline">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">Shop</span>
                    </nav>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-[250px] space-y-6 sticky top-24 h-fit bg-[#1E1E1E] p-4 rounded">
                        {/* Search Bar */}
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Search</h2>
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full p-2 bg-[#101010] border border-gray-600 rounded text-[16px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4500]"
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-2">Car Compatibility</h2>
                            <select
                                className="w-full p-2 bg-[#101010] border border-gray-600 rounded text-[16px] mb-2"
                                value={filters.make}
                                onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                            >
                                <option value="">Select Make</option>
                                {makes.map((m) => (
                                    <option key={m._id} value={m._id}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="w-full p-2 bg-[#101010] border border-gray-600 rounded text-[16px] mb-2"
                                value={filters.model}
                                onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                                disabled={!models.length}
                            >
                                <option value="">Select Model</option>
                                {models.map((m) => (
                                    <option key={m._id} value={m._id}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="w-full p-2 bg-[#101010] border border-gray-600 rounded Dom text-[16px] mb-2"
                                value={filters.year}
                                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                                disabled={!years.length}
                            >
                                <option value="">Select Year</option>
                                {years.map((y) => (
                                    <option key={y._id} value={y._id}>
                                        {y.year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-2">Category</h2>
                            {categories.map((cat) => (
                                <label key={cat._id} className="block text-[16px] text-gray-300">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={filters.categories.includes(cat._id)}
                                        onChange={() => handleCheckboxChange('categories', cat._id)}
                                    />{' '}
                                    {cat.name}
                                </label>
                            ))}
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-2">Brands</h2>
                            {brands.map((brand) => (
                                <label key={brand._id} className="block text-[16px] text-gray-300">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={filters.brands.includes(brand._id)}
                                        onChange={() => handleCheckboxChange('brands', brand._id)}
                                    />{' '}
                                    {brand.name}
                                </label>
                            ))}
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-2">Sort By</h2>
                            <select
                                className="w-full p-2 bg-[#101010] border border-gray-600 rounded text-[16px]"
                                value={filters.sort}
                                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                            >
                                <option value="">Sort</option>
                                <option value="price-asc">Price Low to High</option>
                                <option value="price-desc">Price High to Low</option>
                            </select>
                        </div>

                        <button
                            onClick={handleClearFilters}
                            className="mt-4 w-full bg-[#FF4500] text-white py-2 rounded"
                        >
                            Clear Filters
                        </button>
                    </aside>

                    {/* Product Grid */}
                    <main className="md:w-3/3">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                            </div>
                        ) : products.length ? (
                            <ProductUI tag="Products" products={products} />
                        ) : (
                            <p className="text-white text-center text-lg mt-10">No products found.</p>
                        )}
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Shop;