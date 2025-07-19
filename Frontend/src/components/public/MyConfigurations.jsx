import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Wrench, Edit, Trash2 } from "lucide-react";
import Navbar from "../common/customer/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Component } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import SidebarNav from "../common/customer/SidebarNav";

const customerId = localStorage.getItem("userId");

// Simple ErrorBoundary component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#101010] text-white font-rajdhani flex flex-col items-center justify-center">
          <h1 className="text-[24px] font-semibold mb-4">Oops! Something went wrong.</h1>
          <p className="text-[16px] text-gray-400 mb-4">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FF4500] text-white rounded hover:bg-[#FF5722]"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function MyConfigurations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Added to handle query invalidation

  const { data: configurations = [], isLoading, error } = useQuery({
    queryKey: ["configurations", customerId],
    queryFn: async () => {
      if (!customerId) {
        toast.error("Please login first", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: true,
          theme: "dark",
        });
        navigate("/login");
        return [];
      }
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/customization/customer/${customerId}`
        );
        const configs = res.data.data.filter(
          (config) => config.bookingStatus === "saved"
        );
        console.log("Fetched configurations:", configs);
        return configs;
      } catch (err) {
        console.error("Error fetching configurations:", err);
        throw new Error("Failed to fetch configurations");
      }
    },
    enabled: !!customerId,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (configId) => {
      await axios.delete(`http://localhost:3000/api/v1/customization/${configId}`);
    },
    onSuccess: () => {
      toast.success("Configuration deleted successfully!");
      queryClient.invalidateQueries(["configurations", customerId]); // Invalidate query to refetch
    },
    onError: (error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });

  const handleEdit = (config) => {
    const modelId = config.model?._id || config.model;
    const year = config.year?.year || config.year;

    if (!modelId || !year || !config._id) {
      toast.error("Invalid configuration data", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        theme: "dark",
      });
      return;
    }

    navigate(`/customization?model=${modelId}&year=${year}&editConfigId=${config._id}`);
  };

  const handleBookModification = (config) => {
    const customizationData = {
      model: config.model,
      year: config.year,
      selectedOptions: config.selectedOptions,
      notes: config.notes,
      image: config.image,
    };
    navigate("/modification-booking", { state: { customization: customizationData } });
  };

  const formatPrice = (value) => {
    return typeof value === "number" && !isNaN(value) ? value.toFixed(2) : "N/A";
  };

  const calculateTotalPrice = (config) => {
    if (config.totalAmount && typeof config.totalAmount === "number") {
      return config.totalAmount;
    }
    return config.selectedOptions.reduce(
      (total, opt) => total + (opt.option?.price || 0),
      0
    );
  };

  // Handle delete with confirmation
  const handleDelete = (configId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this configuration? This action cannot be undone.",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteMutation.mutate(configId),
        },
        {
          label: "No",
          onClick: () => {}, // Do nothing on cancel
        },
      ],
    });
  };

  return (
    <ErrorBoundary>
      <Navbar />
      <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-6 md:px-10 py-10 flex flex-col md:flex-row gap-10">
        <SidebarNav />
        <div className="w-full md:w-3/4 space-y-8">
          <h1 className="text-[24px] font-semibold mb-6">My Configurations</h1>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {configurations.map((config) => (
                <div
                  key={config._id}
                  className="bg-[#2A2A2A] p-4 rounded shadow-lg w-[290px] min-h-[400px] flex flex-col relative"
                >
                  {/* Delete button with circular white background */}
                  <button
                    onClick={() => handleDelete(config._id)}
                    className="absolute top-2 right-2 p-1 transition z-10 bg-white rounded-full"
                    disabled={deleteMutation.isLoading}
                    title="Delete configuration"
                  >
                    <Trash2 className="text-red-800 text-sm" />
                  </button>

                  <div className="flex flex-col items-start flex-grow">
                    <div className="relative w-full h-48 mb-4">
                      <img
                        src={config.image || "/images/placeholder.png"}
                        alt={`${config.model?.name || "Unknown Model"} ${
                          config.year?.year || "Unknown Year"
                        }`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <h3 className="text-[18px] font-semibold">
                      {config.model?.name || "Unknown Model"} {config.year?.year || "Unknown Year"}
                    </h3>
                    <p className="text-[16px] text-white mt-1">
                      Saved on: {new Date(config.createdAt).toLocaleString()}
                    </p>
                    <p className="text-[16px] font-bold mt-2">
                      Total: Rs. {formatPrice(calculateTotalPrice(config))}
                    </p>
                    <div className="mt-auto flex space-x-4 pt-4">
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
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar theme="dark" />
    </ErrorBoundary>
  );
}