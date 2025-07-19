import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../common/customer/Navbar";
import Footer from "../common/customer/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe publishable key
const stripePromise = loadStripe("pk_test_51Rj36I4CYapQbNJ7tHDHQotrP52b6bjDWYPAK2oWG3D6qV1KqTFe1KdR4vvOBNQj7YeTbuczIW6tkEjl9I9GjU7u006oU4VbKf");

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
  // Add more mappings as needed based on your data
};

function StripeForm({ customization, shippingAddress, paymentMethod, customerId, setStep, isShared, bookingDate, timeSlot, totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Custom styles for CardElement to match dark theme
  const cardElementOptions = {
    style: {
      base: {
        color: "#ffffff",
        backgroundColor: "#101010",
        fontFamily: "Rajdhani, sans-serif",
        fontSize: "16px",
        "::placeholder": {
          color: "#6B7280",
        },
        border: "1px solid #4B5563",
        borderRadius: "4px",
      },
      invalid: {
        color: "#EF4444",
        iconColor: "#EF4444",
      },
    },
  };

  useEffect(() => {
    const createIntent = async () => {
      try {
        console.log("Creating payment intent with totalAmount:", totalAmount, "customerId:", customerId);
        const res = await axios.post("http://localhost:3000/api/v1/stripe/create-payment-intent", {
          amount: totalAmount,
          customerId,
        });
        console.log("Payment intent response:", res.data);
        setClientSecret(res.data.clientSecret);
      } catch (error) {
        console.error("Failed to create payment intent:", error.message, error.stack);
        setErrorMessage(`Failed to initialize payment: ${error.message}`);
        toast.error(`Failed to initialize payment: ${error.message}`);
      }
    };

    if (totalAmount > 0 && customerId) {
      console.log("Valid data for payment intent:", { totalAmount, customerId });
      createIntent();
    } else {
      console.error("Missing required data for payment intent:", { totalAmount, customerId });
      setErrorMessage("Invalid booking data. Please try again.");
      toast.error("Invalid booking data. Please try again.");
    }
  }, [totalAmount, customerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called, isProcessing:", isProcessing);

    if (!stripe || !elements || isProcessing || !clientSecret) {
      console.warn("Cannot submit: stripe, elements, or clientSecret missing, or payment is processing", {
        stripe: !!stripe,
        elements: !!elements,
        clientSecret: !!clientSecret,
        isProcessing,
      });
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const cardElement = elements.getElement(CardElement);
      console.log("Initiating confirmCardPayment for clientSecret:", clientSecret);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        console.error("Payment failed:", result.error.message);
        setErrorMessage(result.error.message);
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", result.paymentIntent);
        try {
          console.log("Creating booking with data:", {
            customerId,
            model: customization.model._id || customization.model,
            year: customization.year._id || customization.year,
            selectedOptions: customization.selectedOptions,
            notes: customization.notes || "",
            shippingAddress,
            paymentMethod,
            bookingStatus: "pending",
            isShared,
            bookingDate,
            timeSlot,
            paymentStatus: "Paid",
            isPaid: true,
            totalAmount,
            image: customization.image || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==", // Include image
          });
          const bookingRes = await axios.post("http://localhost:3000/api/v1/customization", {
            customerId,
            model: customization.model._id || customization.model,
            year: customization.year._id || customization.year,
            selectedOptions: customization.selectedOptions,
            notes: customization.notes || "",
            shippingAddress,
            paymentMethod,
            bookingStatus: "pending",
            isShared,
            bookingDate,
            timeSlot,
            paymentStatus: "Paid",
            isPaid: true,
            totalAmount,
            image: customization.image || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==", // Include image
          });
          console.log("Booking created successfully:", bookingRes.data);
          toast.success("Modification booked successfully!");
          setStep(3);
        } catch (bookingError) {
          console.error("Booking creation failed after payment:", bookingError.message, bookingError.stack);
          setErrorMessage(`Payment succeeded but booking creation failed: ${bookingError.message}`);
          toast.error(`Payment succeeded but booking creation failed: ${bookingError.message}`);
        }
      }
    } catch (error) {
      console.error("Error in confirmCardPayment:", error.message, error.stack);
      setErrorMessage(`Payment error: ${error.message}`);
      toast.error(`Payment error: ${error.message}`);
    } finally {
      setIsProcessing(false);
      console.log("Payment processing completed, isProcessing set to false");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-[#101010] rounded border border-gray-600">
        <CardElement options={cardElementOptions} />
      </div>

      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

      {/* Centered Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className={`bg-[#FF4500] w-[200px] text-white px-6 py-2 rounded hover:bg-orange-600 ${
            isProcessing || !stripe || !clientSecret ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isProcessing || !stripe || !clientSecret}
        >
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </div>
    </form>
  );
}

export default function ModificationBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  const customization = location.state?.customization || null;

  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isShared, setIsShared] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTimeSlot, setBookingTimeSlot] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const customerId = localStorage.getItem("userId");

  // Calculate totalAmount
  const totalAmount =
    customization?.totalAmount ||
    (customization?.selectedOptions?.reduce((acc, opt) => acc + (opt.price || 1000), 0) + 500) ||
    10000;

  useEffect(() => {
    if (!customization) {
      toast.error("No customization data found. Please customize your car first.");
      navigate("/customization-studio");
    } else {
      setBookingDate(format(new Date(), "yyyy-MM-dd"));
    }
  }, [customization, navigate]);

  const mutation = useMutation({
    mutationFn: (bookingData) => {
      console.log("Creating booking with data:", bookingData);
      return axios.post("http://localhost:3000/api/v1/customization", bookingData);
    },
    onSuccess: (response) => {
      console.log("Booking created successfully:", response.data);
      toast.success("Modification booked successfully!");
      setStep(3);
    },
    onError: (error) => {
      console.error("Booking creation failed:", error.message, error.stack);
      if (error.response?.status === 409) {
        toast.error(error.response.data.message || "Time slot already booked.");
      } else {
        toast.error(`Failed to book modification: ${error.response?.data?.message || "Please try again."}`);
      }
    },
  });

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}: ${value}`);
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    const requiredFields = ["name", "email", "phone", "street", "city", "state", "postalCode"];
    const missing = requiredFields.filter((field) => !shippingAddress[field]?.trim());
    if (missing.length > 0) {
      toast.error(`Please fill all shipping fields: ${missing.join(", ")}`);
      return false;
    }
    if (!["cod", "Stripe"].includes(paymentMethod)) {
      toast.error("Please select a valid payment method");
      return false;
    }
    if (!bookingDate || !bookingTimeSlot) {
      toast.error("Please select a booking date and time slot.");
      return false;
    }
    if (!totalAmount || totalAmount <= 0) {
      toast.error("Invalid total amount. Please try again.");
      return false;
    }
    const today = new Date();
    const selectedDate = new Date(bookingDate);
    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      toast.error("Please select a future or current date.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(shippingAddress.phone)) {
      toast.error("Please enter a valid phone number (7-15 digits).");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    console.log("Handling next step, current step:", step);
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateShipping()) {
        if (paymentMethod === "Stripe") {
          console.log("Advancing to Stripe payment step (2.5)");
          setStep(2.5);
        } else {
          setIsProcessing(true); // Start processing without confirm
          mutation.mutate(
            {
              customerId,
              model: customization.model._id || customization.model,
              year: customization.year._id || customization.year,
              selectedOptions: customization.selectedOptions,
              notes: customization.notes || "",
              shippingAddress,
              paymentMethod,
              bookingStatus: "pending",
              isShared,
              bookingDate,
              timeSlot: bookingTimeSlot,
              paymentStatus: "Pending",
              isPaid: false,
              totalAmount,
              image: customization.image || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==", // Include image
            },
            {
              onSettled: () => {
                console.log("Booking mutation settled");
                setIsProcessing(false);
              },
            }
          );
        }
      }
    }
  };

  if (!customization) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center text-red-500">Loading customization data...</div>
        <Footer />
      </>
    );
  }

  // Debug the selectedOptions structure
  useEffect(() => {
    console.log("customization.selectedOptions:", customization.selectedOptions);
  }, [customization]);

  const selectedParts = customization.selectedOptions.reduce((acc, opt) => {
    const partName = opt.title || `Part_${opt.option || "Unknown"}`;
    const colorName = colorCodeToName[opt.colorCode] || opt.colorCode || "Unknown Color";
    acc[partName] = colorName;
    return acc;
  }, {});
  console.log("Selected Parts:", selectedParts);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#101010] text-white font-rajdhani px-6 md:px-20 py-10 flex flex-col gap-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-white">Book Your Modification</h1>

        <div className="flex items-center justify-between max-w-2xl mx-auto mb-12">
          {[1, 2, 3].map((s, index) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold ${
                  step >= s ? "bg-[#FF4500] text-white" : "bg-[#1E1E1E] border border-gray-500 text-gray-400"
                }`}
              >
                {s}
              </div>
              {index < 2 && (
                <div
                  className={`flex-1 h-2 mx-4 ${step > s ? "bg-[#FF4500]" : "bg-gray-600"}`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-[#1E1E1E] p-8 rounded-xl shadow-lg space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-6">Review Your Customization</h2>
            <div className="space-y-4 text-[16px] text-white">
              <div className="relative w-full h-64 mb-4">
                <img
                  src={customization.image || "/assets/images/placeholder.png"}
                  alt={`${customization.model?.name || "Unknown Model"} ${customization.year?.year || "Unknown Year"}`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <p>
                <strong className="text-white">Model:</strong>{" "}
                {customization.model?.name || customization.model}
              </p>
              <p>
                <strong className="text-white">Year:</strong>{" "}
                {customization.year?.year || customization.year}
              </p>
              <p>
                <strong className="text-white">Total Amount:</strong> NPR {totalAmount}
              </p>
              <div>
                <strong className="text-white">Selected Options:</strong>
                <ul className="list-disc list-inside mt-2 text-white">
                  {Object.entries(selectedParts).length > 0 ? (
                    Object.entries(selectedParts).map(([part, color], i) => (
                      <li key={i} className="ml-4">
                        {part} - <span className="text-white">Color: {color}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-white">No options selected</li>
                  )}
                </ul>
              </div>
            </div>
            <button
              onClick={handleNextStep}
              className="bg-[#FF4500] px-4 py-2 rounded-md text-white w-48 mx-auto block"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-[#1E1E1E] p-8 rounded-xl shadow-lg space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={shippingAddress.name}
                onChange={handleShippingChange}
                className="w-full p-3 bg-[#101010] border border-gray-600 rounded-lg text-white"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={shippingAddress.email}
                onChange={handleShippingChange}
                className="w-full p-3 bg-[#101010] border border-gray-600 rounded-lg text-white "
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={shippingAddress.phone}
                onChange={handleShippingChange}
                className="w-full p-3 bg-[#101010] border border-gray-600 rounded-lg text-white "
                required
              />
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={shippingAddress.street}
                onChange={handleShippingChange}
                className="w-full p-3 bg-[#101010] border border-gray-600 rounded-lg text-white "
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                  className="p-3 bg-[#101010] border border-gray-600 rounded-lg text-white "
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={handleShippingChange}
                  className="p-3 bg-[#101010] border border-gray-600 rounded-lg text-white "
                  required
                />
              </div>
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={shippingAddress.postalCode}
                onChange={handleShippingChange}
                className="w-full p-3 bg-[#101010] border border-gray-600 rounded-lg text-white "
                required
              />
            </div>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Booking Date & Time</h2>
            <div className="space-y-4">
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
                className="w-full p-3 bg-[#101010] border border-gray-600 rounded-lg text-white  calendar-white"
                required
              />
              <style jsx>{`
                .calendar-white::-webkit-calendar-picker-indicator {
                  filter: invert(1);
                }
              `}</style>
              <select
                value={bookingTimeSlot}
                onChange={(e) => setBookingTimeSlot(e.target.value)}
                className="w-full p-3 bg-[#101010] border border-gray-600 rounded-lg text-white "
                required
              >
                <option value="">Select Time Slot</option>
                <option value="09:00-11:00">09:00 AM - 11:00 AM</option>
                <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
                <option value="13:00-15:00">01:00 PM - 03:00 PM</option>
                <option value="15:00-17:00">03:00 PM - 05:00 PM</option>
              </select>
            </div>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-[#101010] rounded-lg cursor-pointer hover:bg-[#2A2A2A]">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => {
                    console.log("Selected payment method: COD");
                    setPaymentMethod("cod");
                  }}
                  className="text-[#FF4500] focus:ring-[#FF4500]"
                  required
                />
                <span className="text-[16px] ">Cash on Delivery (COD)</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-[#101010] rounded-lg cursor-pointer hover:bg-[#2A2A2A]">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Stripe"
                  checked={paymentMethod === "Stripe"}
                  onChange={() => {
                    console.log("Selected payment method: Stripe");
                    setPaymentMethod("Stripe");
                  }}
                  className="text-[#FF4500] focus:ring-[#FF4500]"
                  required
                />
                <span className="text-[16px] ">Stripe</span>
              </label>
            </div>
            <button
              onClick={handleNextStep}
              className={`bg-[#FF4500] px-4 py-2 rounded-md  text-white w-48 mx-auto block mt-8 ${
                isProcessing || mutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isProcessing || mutation.isLoading}
            >
              {paymentMethod === "Stripe" ? "Next" : mutation.isLoading ? "Booking..." : "Book Modification"}
            </button>
          </div>
        )}

        {step === 2.5 && (
          <div className="bg-[#1E1E1E] p-8 rounded-xl shadow-lg space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-6">Complete Payment with Stripe</h2>
            <Elements stripe={stripePromise}>
              <StripeForm
                customization={customization}
                shippingAddress={shippingAddress}
                paymentMethod={paymentMethod}
                customerId={customerId}
                setStep={setStep}
                isShared={isShared}
                bookingDate={bookingDate}
                timeSlot={bookingTimeSlot}
                totalAmount={totalAmount}
              />
            </Elements>
          </div>
        )}

        {step === 3 && (
          <div className="bg-[#1E1E1E] p-8 rounded-xl shadow-lg text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold text-white mb-6">Thank You!</h2>
            <p className="text-gray-400 text-lg mb-4">Your modification is booked.</p>
            <p className="text-gray-400 text-lg mb-4">
              Booking Date: {bookingDate} | Time Slot: {bookingTimeSlot}
            </p>
            <p className="text-gray-400 text-lg mb-6">
              Payment Method: {paymentMethod === "cod" ? "Cash on Delivery" : "Stripe"}
            </p>
            <button
              onClick={() => navigate("/my-booking")}
              className="bg-[#FF4500] px-4 py-2 rounded-md text-white w-40 mx-auto block"
            >
              View My Booking
            </button>
          </div>
        )}
      </div>

      <ToastContainer hideProgressBar theme="dark" position="top-right" autoClose={4000} limit={1} />
      <Footer />
    </>
  );
}