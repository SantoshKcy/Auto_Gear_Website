import { useEffect, useState } from 'react';
import { FaSearch, FaTags } from 'react-icons/fa';
import axios from 'axios';

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const paymentOptions = ['Pending', 'Paid', 'Failed'];
const paymentMethodOptions = ['Stripe', 'cod'];

const AllOrders = () => {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/order', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Fetched orders:', res.data.data); // Log orders for debugging
        setOrders(res.data.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error.message, error.stack);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, field, value) => {
    try {
      console.log(`Updating ${field} for order ${orderId} to ${value}`);
      await axios.put(
        `http://localhost:3000/api/v1/order/${orderId}/status`,
        { [field]: value },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, [field]: value } : order
        )
      );
    } catch (error) {
      console.error(`Failed to update ${field}:`, error.message, error.stack);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const fullName = `${order.customerId?.fname || ''} ${order.customerId?.lname || ''}`;
    return (
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      fullName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-500';
      case 'Processing':
        return 'text-blue-500';
      case 'Shipped':
        return 'text-indigo-500';
      case 'Delivered':
        return 'text-green-600';
      case 'Cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-700';
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-500';
      case 'Paid':
        return 'text-green-600';
      case 'Failed':
        return 'text-red-500';
      default:
        return 'text-gray-700';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'Stripe':
        return 'text-purple-600';
      case 'cod':
        return 'text-orange-500';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaTags /> All Orders ({orders.length})
        </h2>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search by Order ID or Customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg pl-10 pr-4 py-2 w-full"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading orders...</div>
      ) : (
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">SN</th>
              
              <th className="py-2 px-4 border-b">Order Date</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Product Details</th>
              <th className="py-2 px-4 border-b">Order Status</th>
              <th className="py-2 px-4 border-b">Payment Method</th>
              <th className="py-2 px-4 border-b">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order._id} className="text-center">
                <td className="py-2 px-4 border-b">{index + 1}</td>
               
                <td className="py-2 px-4 border-b">{formatDate(order.orderDate)}</td>
                <td className="py-2 px-4 border-b">
                  <div>
                    {order.customerId
                      ? `${order.customerId.fname} ${order.customerId.lname}`
                      : 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-500">{order.customerId?.email}</div>
                </td>
                <td className="py-2 px-4 border-b">Rs {order.totalAmount.toFixed(2)}</td>
                <td className="py-2 px-4 border-b text-left">
                  <ul className="list-disc pl-4 text-sm">
                    {order.products.map((item) => (
                      <li key={item._id}>
                        {item.productId?.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusUpdate(order._id, 'orderStatus', e.target.value)
                    }
                    className={`text-sm border rounded px-2 py-1 ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  <span className={`text-sm ${getPaymentMethodColor(order.paymentMethod)}`}>
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={order.paymentStatus}
                    onChange={(e) =>
                      handleStatusUpdate(order._id, 'paymentStatus', e.target.value)
                    }
                    className={`text-sm border rounded px-2 py-1 ${getPaymentColor(
                      order.paymentStatus
                    )}`}
                  >
                    {paymentOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllOrders;