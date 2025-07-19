import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Wrench, Edit } from 'lucide-react';
import Navbar from '../common/customer/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const customerId = localStorage.getItem('userId');

export default function MyConfiguration() {
  const navigate = useNavigate();

  const { data: configurations = [], isLoading, error } = useQuery({
    queryKey: ['configurations', customerId],
    queryFn: async () => {
      if (!customerId) {
        toast.error('Please login first', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: true,
          theme: 'dark',
        });
        navigate('/login');
        return [];
      }
      const res = await axios.get(`http://localhost:3000/api/v1/customization/customer/${customerId}`);
      return res.data.data.filter((config) => config.bookingStatus === 'saved') || [];
    },
    enabled: !!customerId,
  });

  const handleEdit = (config) => {
    navigate(`/customization?make=${config.make}&model=${config.model}&year=${config.year}&editConfigId=${config._id}`);
  };

  const handleBookModification = (config) => {
    const customizationData = {
      model: config.model,
      year: config.year,
      selectedOptions: config.selectedOptions,
      notes: config.notes,
    };
    navigate('/modification-booking', { state: { customization: customizationData } });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-8 py-6">
        <h1 className="text-[24px] font-semibold mb-6">My Configurations</h1>
        <div className="bg-[#1E1E1E] p-6 rounded">
          {isLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <p>Loading configurations...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[200px]">
              <p>Error loading configurations: {error.message}</p>
            </div>
          ) : configurations.length === 0 ? (
            <p className="text-[16px] text-gray-400">No saved configurations found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {configurations.map((config) => (
                <div
                  key={config._id}
                  className="bg-[#2A2A2A] p-4 rounded relative"
                >
                  <div className="flex flex-col items-start">
                    <div className="relative w-full h-48 mb-4">
                      <img
                        src={config.image || '/assets/images/placeholder.png'}
                        alt={`${config.modelData?.name} ${config.yearData?.year}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <h3 className="text-[18px] font-semibold">
                      {config.modelData?.name} {config.yearData?.year}
                    </h3>
                    <p className="text-[16px] text-gray-400 mt-1">Saved on: {new Date(config.createdAt).toLocaleString()}</p>
                    <p className="text-[16px] font-bold mt-2">Total: Rs. {config.totalAmount.toFixed(2)}</p>
                    <div className="mt-4 space-y-2">
                      {config.selectedOptions.map((opt, index) => (
                        <p key={index} className="text-[14px]">
                          <span className="font-semibold">{opt.title}:</span>{' '}
                          {opt.colorCode ? `Color (${opt.colorCode})` : opt.option.title} (Rs. {opt.price || 0})
                        </p>
                      ))}
                    </div>
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => handleEdit(config)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-[#FF4500] hover:underline"
                      >
                        <Edit size={18} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleBookModification(config)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-[#FF4500] hover:underline"
                      >
                        <Wrench size={18} />
                        <span>Book Modification</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        theme="dark"
      />
    </>
  );
}