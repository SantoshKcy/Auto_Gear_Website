import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Support = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch contacts on mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/contact', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Optional
          },
        });
        setFeedbacks(res.data.data);
      } catch (err) {
        console.error('Error fetching contacts:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Format date
  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-3">
      <h2 className="text-xl font-medium text-left text-black mb-8 flex items-center space-x-2">
        <MessageCircle className="text-black w-5 h-5" />
        <span>Customer Feedback</span>
      </h2>

      {loading ? (
        <div className="text-center text-gray-500 py-6">Loading feedback...</div>
      ) : (
        <table className="min-w-full bg-white rounded-lg shadow-md text-black overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Message</th>
              <th className="py-2 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb._id} className="border-b">
                <td className="py-2 px-4">{fb.firstName} {fb.lastName}</td>
                <td className="py-2 px-4">{fb.email}</td>
                <td className="py-2 px-4">{fb.phone}</td>
                <td className="py-2 px-4">{fb.message}</td>
                <td className="py-2 px-4">{formatDate(fb.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Support;
