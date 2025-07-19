import { Card } from "@/components/common/ui/card";
import axios from "axios";
import {
    LayoutDashboard,
    List,
    ShoppingBag,
    User
} from "lucide-react";
import { useEffect, useState } from "react";
import { FaTags } from "react-icons/fa";
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Pie,
    PieChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const API_BASE_URL = "http://localhost:3000/api/v1"; // Backend base URL

const Dashboard = () => {
    const [users, setUsers] = useState(0);
    const [orders, setOrders] = useState(0);
    const [products, setProducts] = useState(0);
    const [category, setCategory] = useState(0);
    const [mostViewed, setMostViewed] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await axios.get(`${API_BASE_URL}/auth/getCustomers`);
                setUsers(userRes.data.count || 0);

                const productRes = await axios.get(`${API_BASE_URL}/product/`);
                setProducts(productRes.data.count || 0);
                const categoryRes = await axios.get(`${API_BASE_URL}/category/getCategories`);
                setCategory(categoryRes.data.count || 0);

                const orderRes = await axios.get(`${API_BASE_URL}/order/orders`);
                setOrders(orderRes.data.length || 0);
                const res = await axios.get(`${API_BASE_URL}/products/most-viewed`);
                setMostViewed(res.data.data || []); // set only the array, not whole object



            } catch (err) {
                console.error("Dashboard data error:", err);
            }
        };

        fetchData();
    }, []);

    const barData = [
        { name: "Jan", orders: 24, revenue: 45000 },
        { name: "Feb", orders: 30, revenue: 61000 },
        { name: "Mar", orders: 20, revenue: 39000 },
        { name: "Apr", orders: 50, revenue: 88000 },
        { name: "May", orders: 40, revenue: 72000 },
        { name: "Jun", orders: 60, revenue: 94000 },
    ];

    const pieData = [
        { name: "Wraps", value: 240 },
        { name: "Kits", value: 180 },
        { name: "Interior", value: 150 },
        { name: "Wheels", value: 120 },
    ];

    const COLORS = ["#FF4500", "#FF7918", "#FFBB28", "#00C49F"];

    return (
        <div className="p-3 space-y-4">
            <div className="flex items-center text-black gap-2 text-xl font-semibold">
                <LayoutDashboard size={28} />
                Dashboard
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-4 bg-blue-400 shadow-md">
                    <User size={32} />
                    <div>
                        <h2 className="text-lg font-semibold">Users</h2>
                        <p className="text-xl font-bold">{users}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-green-400 shadow-md">
                    <ShoppingBag size={32} />
                    <div>
                        <h2 className="text-lg font-semibold">Orders</h2>
                        <p className="text-xl font-bold">{orders}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-orange-400 shadow-md">
                    <FaTags size={32} />
                    <div>
                        <h2 className="text-lg font-semibold">Categories</h2>
                        <p className="text-xl font-bold">{category}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-red-400 shadow-md">
                    <List size={32} />
                    <div>
                        <h2 className="text-lg font-semibold">Products</h2>
                        <p className="text-xl font-bold">{products}</p>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
                <Card className="p-4 shadow-md col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Orders & Revenue Trend</h2>
                    <BarChart width={600} height={300} data={barData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" fill="#FF4500" />
                        <Bar dataKey="revenue" fill="#00C49F" />
                    </BarChart>
                </Card>

                <Card className="p-4 shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Top Modification Categories</h2>
                    <div className="flex justify-center items-center">
                        <PieChart width={300} height={300}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ name }) => name}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                </Card>
            </div>

            {/* Example Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4  bg-gray-100 text-black shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Top Selling Mods</h2>
                    <ul className="list-disc ml-4">
                        <li>Matte Black Wrap – 120 orders</li>
                        <li>LED Underglow Kit – 95 orders</li>
                        <li>Carbon Spoiler – 75 orders</li>
                        <li>Alloy Rims – 68 orders</li>
                    </ul>
                </Card>



                <Card className="p-4 shadow-md bg-gray-100 text-black">
                    <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
                    <ul className="list-disc ml-4">
                        <li>Order #1234 – by Anil, July 1</li>
                        <li>Order #1233 – by Sita, June 30</li>
                        <li>Order #1232 – by Raj, June 29</li>
                        <li>Order #1231 – by Meena, June 28</li>
                    </ul>
                </Card>
                {/* <Card className="p-4 shadow-md">
    <h2 className="text-lg font-semibold mb-4">Low Stock Alerts</h2>
    <ul className="list-disc ml-4">
        <li>Carbon Spoiler – 3 left</li>
        <li>LED Kit – 5 left</li>
        <li>Red Wrap – 2 left</li>
        <li>Chrome Rims – 4 left</li>
    </ul>
</Card> */}


            </div>
        </div>
    );
};

export default Dashboard;
