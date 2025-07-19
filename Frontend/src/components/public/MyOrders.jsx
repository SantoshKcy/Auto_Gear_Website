
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from '../common/customer/Navbar';
import Footer from '../common/customer/Footer';
import SidebarNav from '../common/customer/SidebarNav';

export default function MyOrders() {
  const customerId = localStorage.getItem('userId');

  const { data, error, isLoading } = useQuery({
    queryKey: ['orders', customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const res = await axios.get(`http://localhost:3000/api/v1/order/customer/${customerId}`);
      return res.data.data;
    },
    enabled: !!customerId,
  });

  const statusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-[#FFFFFF1A] text-yellow-300';
      case 'processing':
        return 'bg-[#FFFFFF1A] text-blue-400';
      case 'shipped':
        return 'bg-[#FFFFFF1A] text-indigo-400';
      case 'delivered':
        return 'bg-[#FFFFFF1A] text-green-500';
      case 'cancelled':
        return 'bg-[#FFFFFF1A] text-red-500';
      default:
        return 'bg-[#FFFFFF1A] text-gray-400';
    }
  };

  const paymentBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-[#FFFFFF1A] text-yellow-300';
      case 'paid':
        return 'bg-[#FFFFFF1A] text-green-500';
      case 'failed':
        return 'bg-[#FFFFFF1A] text-red-500';
      default:
        return 'bg-[#FFFFFF1A] text-gray-400';
    }
  };

  if (!customerId) {
    return <div className="p-10 text-center text-red-500">Please log in to view your orders.</div>;
  }

  if (isLoading) {
    return <div className="p-10 text-center text-white">Loading your orders...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">Failed to load orders. Please try again later.</div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-10 text-center text-gray-400">You have no orders yet.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-6 md:px-10 py-10 flex flex-col md:flex-row gap-10">
        <SidebarNav />

        <div className="w-full md:w-3/4 space-y-8">
          <h1 className="text-3xl font-bold mb-4 text-white">My Orders</h1>

          <div className="grid gap-6">
            {data.map((order) => (
              <div
                key={order._id}
                className="bg-[#1E1E1E] rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <p className="text-sm text-gray-300 mb-1">
                  <strong>Order Date:</strong>{' '}
                  {new Date(order.orderDate).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>

                <p className="text-sm text-gray-300 mb-2">
                  <strong>Payment Status:</strong>{' '}
                  <span className={`px-2 py-0.5 rounded font-medium ${paymentBadge(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>{' '}
                  | <strong>Method:</strong> {order.paymentMethod}
                </p>

                <p className="text-lg font-bold text-white mb-4">Total: Rs. {order.totalAmount.toFixed(2)}</p>

                {order.deliveryDate && (
                  <p className="text-sm text-gray-400 mb-4">
                    <strong>Delivery Date:</strong>{' '}
                    {new Date(order.deliveryDate).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}

                <div className="mb-4">
                  <h3 className="font-semibold mb-1 text-white">Shipping Address</h3>
                  <p className="text-gray-300">{order.shippingAddress.name}</p>
                  <p className="text-gray-300">{order.shippingAddress.email}</p>
                  <p className="text-gray-300">{order.shippingAddress.phone}</p>
                  <p className="text-gray-300">
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                    {order.shippingAddress.postalCode}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-white">Products</h3>
                  <ul className="space-y-3 max-h-48 overflow-y-auto">
                    {order.products.map((item) => {
                      const product = item.productId;
                      return (
                        <li key={product._id || product} className="flex items-center gap-4">
                          <img
                            src={`http://localhost:3000/uploads/${product.image[0]}`}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md border border-gray-600"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{product.name || 'Unnamed Product'}</p>
                            <p className="text-sm text-gray-400">
                              Qty: {item.quantity}{' '}
                              {item.selectedVariant && (
                                <>
                                  {item.selectedVariant.material && `| Material: ${item.selectedVariant.material} `}
                                  {item.selectedVariant.color && `| Color: ${item.selectedVariant.color} `}
                                  {item.selectedVariant.dimensions &&
                                    `| Dimensions: ${item.selectedVariant.dimensions}`}
                                </>
                              )}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}