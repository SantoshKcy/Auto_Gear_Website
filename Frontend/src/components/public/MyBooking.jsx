import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "../common/customer/Navbar";
import Footer from "../common/customer/Footer";
import SidebarNav from "../common/customer/SidebarNav";

// Color code to name mapping
const colorCodeToName = {
  "#FF0000": "Red",
  "#00FF00": "Green",
  "#0000FF": "Blue",
  "#FFFF00": "Yellow",
  "#FFA500": "Orange",
  "#800080": "Purple",
  "#000000": "Black",
  "#FFFFFF": "White",
  "#C0C0C0": "Silver",
  "#808080": "Gray",
  "#39FF14": "Chartreuse",
  "#FFD700": "Gold",
  // Add more mappings as needed
};

export default function MyBooking() {
  const customerId = localStorage.getItem("userId");

  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const res = await axios.get(`http://localhost:3000/api/v1/customization/customer/${customerId}`);
      console.log("API Response:", res.data.data); // Debug log
      return res.data.data.filter((item) => item.bookingStatus === "pending"); // Updated to show only pending bookings
    },
    enabled: !!customerId,
  });

  const statusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-[#FFFFFF1A] text-yellow-300";
      case "confirmed":
        return "bg-[#FFFFFF1A] text-green-500";
      case "cancelled":
        return "bg-[#FFFFFF1A] text-red-500";
      default:
        return "bg-[#FFFFFF1A] text-gray-400";
    }
  };

  const paymentBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-[#FFFFFF1A] text-yellow-300";
      case "paid":
        return "bg-[#FFFFFF1A] text-green-500";
      case "failed":
        return "bg-[#FFFFFF1A] text-red-500";
      default:
        return "bg-[#FFFFFF1A] text-gray-400";
    }
  };

  if (!customerId) {
    return <div className="p-10 text-center text-red-500">Please log in to view your bookings.</div>;
  }

  if (isLoading) {
    return (
      <div className="p-10 text-center text-white">
        <svg
          className="animate-spin h-5 w-5 mx-auto text-[#FF4500]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading your bookings...
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">Failed to load bookings: {error.message || "Please try again later."}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-10 text-center text-gray-400">You have no bookings yet.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-6 md:px-10 py-10 flex flex-col md:flex-row gap-10">
        <SidebarNav />
        <div className="w-full md:w-3/4 space-y-8">
          <h1 className="text-3xl font-bold mb-4 text-white">My Bookings</h1>

          <div className="grid gap-6">
            {data.map((item) => (
              <div key={item._id} className="bg-[#1E1E1E] rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <div className="relative w-20 h-20">
                    <img
                      src={item.image || "/images/placeholder.png"} // Updated placeholder path
                      alt={`${item.model?.name || "Unknown Model"} ${item.year?.year || "Unknown Year"}`}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.src = "/images/placeholder.png"; // Fallback to placeholder
                        console.log("Image load failed, using placeholder");
                      }}
                    />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge(item.bookingStatus)}`}
                    aria-label={`Booking status: ${item.bookingStatus}`}
                  >
                    {item.bookingStatus}
                  </span>
                </div>

                <div className="text-sm text-gray-300 mb-2">
                  <p>
                    <strong>Model:</strong> {item.model?.name || "Unknown Model"}
                  </p>
                  <p>
                    <strong>Year:</strong> {item.year?.year || "Unknown Year"}
                  </p>
                  <p>
                    <strong>Booking Date:</strong>{" "}
                    {item.bookingDate
                      ? new Date(item.bookingDate).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Time Slot:</strong> {item.timeSlot || "N/A"}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <span
                      className={`px-2 py-0.5 rounded font-medium ${paymentBadge(item.paymentStatus)}`}
                      aria-label={`Payment status: ${item.paymentStatus}`}
                    >
                      {item.paymentStatus || "N/A"}
                    </span>{" "}
                    | <strong>Method:</strong> {item.paymentMethod || "N/A"}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> NPR {item.totalAmount?.toFixed(2) || "N/A"}
                  </p>
                </div>

                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Selected Options</h3>
                    <ul className="space-y-3 max-h-48 overflow-y-auto">
                      {item.selectedOptions.map((option) => (
                        <li key={option.option?._id || option._id} className="text-sm text-gray-300">
                          {option.option?.title || "Unknown Option"}{" "}
                          {option.colorCode && (
                            <span className="text-gray-400">
                              | Color: {colorCodeToName[option.colorCode] || option.colorCode}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}