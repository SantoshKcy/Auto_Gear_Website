import { useEffect, useState } from 'react';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const bookingStatusOptions = ['saved', 'pending', 'confirmed', 'cancelled'];

const Booking = () => {
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/customization/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setBookings(res.data.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle bookingStatus update
  const handleStatusUpdate = async (bookingId, field, value) => {
    setUpdatingId(bookingId);
    try {
      await axios.put(
        `http://localhost:3000/api/v1/customization/${bookingId}`,
        { [field]: value },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, [field]: value } : booking
        )
      );
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
      alert(`Failed to update ${field}. Please try again.`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter bookings by search text matching ID, customer name, or email
  const filteredBookings = bookings.filter((booking) => {
    const bookingIdMatch = booking._id.toLowerCase().includes(search.toLowerCase());
    const custName =
      booking.customerId?.fname && booking.customerId?.lname
        ? `${booking.customerId.fname} ${booking.customerId.lname}`
        : '';
    const custEmail = booking.customerId?.email || booking.shippingAddress?.email || '';

    return (
      bookingIdMatch ||
      custName.toLowerCase().includes(search.toLowerCase()) ||
      custEmail.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get CSS color classes for bookingStatus
  const getStatusColor = (bookingStatus) => {
    switch (bookingStatus) {
      case 'saved':
        return 'text-gray-400';
      case 'pending':
        return 'text-yellow-500';
      case 'confirmed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-700';
    }
  };

  // Get CSS color classes for payment method and payment status
  const getPaymentColor = (value) => {
    switch (value?.toLowerCase()) {
      case 'cod':
      case 'pending':
        return 'text-yellow-500';
      case 'stripe':
      case 'paid':
        return 'text-green-600';
      case 'failed':
        return 'text-red-500';
      case null:
      case undefined:
        return 'text-gray-400';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaCalendarAlt /> All Bookings ({bookings.length})
        </h2>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search by Booking ID or Customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg pl-10 pr-4 py-2 w-full"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading bookings...</div>
      ) : (
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">SN</th>
              <th className="py-2 px-4 border-b">Booking Date</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Model & Year</th>
              <th className="py-2 px-4 border-b">Time Slot</th>
              <th className="py-2 px-4 border-b">Booking Status</th>
              <th className="py-2 px-4 border-b">Payment</th>
             
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr key={booking._id} className="text-center align-top">
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{formatDate(booking.bookingDate)}</td>
                <td className="py-2 px-4 border-b">
                  <div>
                    {booking.customerId
                      ? `${booking.customerId.fname} ${booking.customerId.lname}`
                      : 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.customerId?.email || booking.shippingAddress?.email || 'N/A'}
                  </div>
                </td>
                <td className="py-2 px-4 border-b">
                  {booking.model?.name || 'N/A'} - {booking.year?.year || 'N/A'}
                </td>
                <td className="py-2 px-4 border-b">{booking.timeSlot || 'N/A'}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    disabled={updatingId === booking._id}
                    value={booking.bookingStatus || ''}
                    onChange={(e) => handleStatusUpdate(booking._id, 'bookingStatus', e.target.value)}
                    className={`text-sm border rounded px-2 py-1 ${getStatusColor(booking.bookingStatus)}`}
                  >
                    <option value="">Select Status</option>
                    {bookingStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className={`text-sm ${getPaymentColor(booking.paymentMethod)}`}>
                    Method: {booking.paymentMethod ? booking.paymentMethod.charAt(0).toUpperCase() + booking.paymentMethod.slice(1) : 'None'}
                  </div>
                  <div className={`text-sm ${getPaymentColor(booking.paymentStatus)}`}>
                    Status: {booking.paymentStatus || 'N/A'}
                  </div>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Booking;