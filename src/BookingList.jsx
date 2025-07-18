import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../Api/Api";
import { toast } from "sonner";
import { DataContext } from "./Context/DataContext";
import InvoiceBill from "./User/InvoiceBill";

const BookingList = () => {
  const { id } = useParams();
  const listingRequestId = id;
  const { properties, loading: propertiesLoading, error: propertiesError } = useContext(DataContext);

  const [bookings, setBookings] = useState([]);
  const [propertyCategory, setPropertyCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [selectedDate, setSelectedDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear] = useState(new Date().getFullYear());
  const [monthlyRate, setMonthlyRate] = useState(0);
  const [dailyRate, setDailyRate] = useState(0);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false); // State for invoice visibility
  const [bookingDetails, setBookingDetails] = useState(null); // State for booking details

  const userId = 1; // TODO: Replace with actual user ID from auth context

  useEffect(() => {
    const loadRazorpayScript = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        console.log("Razorpay SDK loaded");
        setRazorpayLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
        toast.error("Failed to load payment gateway. Please try again.");
      };
      document.body.appendChild(script);
    };

    loadRazorpayScript();
    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (script) script.remove();
    };
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        console.log("Listing Request ID:", listingRequestId);
        const res = await api.get("/api/Booking/GetPropertyByID", {
          params: { listingRequestId },
        });
        console.log("Booking API Response:", res);
        console.log("Booking API Response Data:", res.data);
        if (res.data?.statusCode === "200") {
          setBookings(Array.isArray(res.data.data) ? res.data.data : []);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error("Fetch Bookings Error:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setBookings([]);
      }
    };

    const setPropertyDetails = () => {
      if (propertiesLoading) return;
      if (propertiesError) {
        setError("Failed to load property data: " + propertiesError);
        setLoading(false);
        return;
      }
      const property = properties.find((p) => p.id === parseInt(listingRequestId));
      if (property) {
        setPropertyCategory(property.category?.trim().toLowerCase() || "resort");
        setMonthlyRate(property.price || 0);
        setDailyRate(property.dailyRate || 1000);
      } else {
        setError("Property not found. Please check the property ID.");
      }
      setLoading(false);
    };

    fetchBookings();
    setPropertyDetails();
  }, [listingRequestId, properties, propertiesLoading, propertiesError]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
    const calendarDays = [];
    for (let i = 0; i < firstDayIndex; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      calendarDays.push(new Date(currentYear, currentMonth, d));
    }
    return calendarDays;
  };

  const isBooked = (date) => {
    return bookings.some((b) => {
      const checkIn = new Date(b.checkInDate);
      const checkOut = new Date(b.checkOutDate);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      return date >= checkIn && date <= checkOut;
    });
  };

  const handleDateClick = (date) => {
    if (!isBooked(date)) {
      setSelectedDate(date);
      setCheckOutDate("");
    }
  };

  const calculateResortAmount = () => {
    if (!selectedDate || !checkOutDate) return 0;
    const checkIn = new Date(selectedDate);
    const checkOut = new Date(checkOutDate);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 0;
    const baseAmount = days * dailyRate;
    const extraAdults = adults > 2 ? (adults - 2) * 300 : 0;
    const childrenCost = children * 150;
    const total = baseAmount + extraAdults + childrenCost;
    console.log("Calculate Resort Amount:", { days, dailyRate, extraAdults, childrenCost, total });
    return total;
  };

  const calculateMonthlyAmount = () => {
    if (selectedMonth === null) return 0;
    const checkIn = new Date(selectedYear, selectedMonth, 1);
    const checkOut = new Date(selectedYear, selectedMonth + 1, 0);
    const months = ((checkOut.getFullYear() - checkIn.getFullYear()) * 12) + checkOut.getMonth() - checkIn.getMonth();
    const total = monthlyRate * (months <= 0 ? 1 : months);
    console.log("Calculate Monthly Amount:", { months, monthlyRate, total });
    return total;
  };

  const handleBookingSubmit = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      toast.error("Payment gateway not loaded. Please try again.");
      return;
    }

    const isResort = propertyCategory === "resort";

    if (isResort) {
      if (!selectedDate || !checkOutDate || new Date(checkOutDate) <= selectedDate) {
        return toast.error("Select valid check-in and check-out dates");
      }
      if (adults < 1) {
        return toast.error("At least one adult is required");
      }
    } else {
      if (selectedMonth === null) {
        return toast.error("Select a month");
      }
    }

    if (!listingRequestId || isNaN(parseInt(listingRequestId))) {
      return toast.error("Invalid listing request ID");
    }

    const amount = isResort ? calculateResortAmount() : calculateMonthlyAmount();
    if (amount <= 0 || isNaN(amount)) {
      return toast.error("Invalid booking amount");
    }

    const payload = {
      userId,
      listingRequestId: parseInt(listingRequestId),
      checkInDate: isResort
        ? selectedDate.toISOString().split("T")[0]
        : new Date(selectedYear, selectedMonth, 1).toISOString().split("T")[0],
      checkOutDate: isResort
        ? new Date(checkOutDate).toISOString().split("T")[0]
        : new Date(selectedYear, selectedMonth + 1, 0).toISOString().split("T")[0],
      adults: isResort ? adults : 0,
      children: isResort ? children : 0,
      amount: Number(amount.toFixed(2)),
    };

    console.log("Sending Payload to /book-and-pay:", JSON.stringify(payload));

    try {
      const orderRes = await api.post("/api/Booking/book-and-pay", payload);
      if (orderRes.data?.statusCode !== "200") {
        console.error("API Error (/book-and-pay):", {
          response: orderRes.data,
          status: orderRes.status,
        });
        return toast.error("Failed to initiate payment: " + (orderRes.data?.message || "Unknown error"));
      }

      const { orderId, key, amount: razorpayAmount, currency } = orderRes.data.data;

      if (!orderId || !key || !razorpayAmount || !currency) {
        console.error("Invalid Razorpay order response:", orderRes.data.data);
        return toast.error("Invalid payment order data received");
      }

      const options = {
        key,
        amount: razorpayAmount,
        currency,
        name: "Rentfest",
        description: `Booking for ${isResort ? "Resort" : "Monthly Rental"}`,
        order_id: orderId,
        handler: (response) => {
          console.log("Razorpay Response:", response);
          if (!response.razorpay_order_id || !response.razorpay_payment_id) {
            console.error("Invalid Razorpay response:", response);
            toast.error("Invalid payment response from gateway");
            return;
          }

          toast.success("Booking and payment confirmed successfully!");
          setBookingDetails(payload); // Store booking details for invoice
          setShowInvoice(true); // Show invoice
          setSelectedDate(null);
          setCheckOutDate("");
          setAdults(1);
          setChildren(0);
          setSelectedMonth(null);
          fetchBookings();
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Booking Error (/book-and-pay):", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error("Error initiating payment: " + (err.response?.data?.message || err.message));
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const renderResortCalendar = () => (
    <>
      <div className="flex justify-between items-center mb-6 mt-20">
        <button
          onClick={() =>
            currentMonth === 0
              ? (setCurrentMonth(11), setCurrentYear(currentYear - 1))
              : setCurrentMonth(currentMonth - 1)
          }
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-md"
        >
          ← Prev
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mt-10">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button
          onClick={() =>
            currentMonth === 11
              ? (setCurrentMonth(0), setCurrentYear(currentYear + 1))
              : setCurrentMonth(currentMonth + 1)
          }
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-md "
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-semibold text-gray-700">{day}</div>
        ))}
        {generateCalendar().map((date, idx) => {
          if (!date) return <div key={idx}></div>;
          const booked = isBooked(date);
          return (
            <div
              key={idx}
              onClick={() => handleDateClick(date)}
              className={`p-3 rounded-lg text-white font-bold shadow cursor-pointer transition ${
                booked
                  ? "bg-yellow-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              title={booked ? "Booked" : "Available"}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-6 p-6 bg-white border rounded-xl shadow-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Confirm Booking</h3>
          <p>Check-in: <strong>{selectedDate.toDateString()}</strong></p>
          <p>Amount: <strong>₹{calculateResortAmount()}</strong></p>
          <div>
            <label className="block text-sm font-medium text-gray-700">Check-out Date:</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              min={selectedDate.toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Adults:</label>
            <input
              type="number"
              min={1}
              value={adults}
              onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
              className="w-20 mt-1 border border-gray-300 rounded-md px-3 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Children:</label>
            <input
              type="number"
              min={0}
              value={children}
              onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
              className="w-20 mt-1 border border-gray-300 rounded-md px-3 py-1"
            />
          </div>
          <button
            onClick={handleBookingSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-lg"
            disabled={!razorpayLoaded}
          >
            Confirm Booking
          </button>
        </div>
      )}
    </>
  );

  const renderNonResortCalendar = () => (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 mt-15">Select Month for Booking</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
        {monthNames.map((monthName, index) => {
          const isBookedMonth = bookings.some((b) => {
            const checkIn = new Date(b.checkInDate);
            const checkOut = new Date(b.checkOutDate);
            const startOfMonth = new Date(selectedYear, index, 1);
            const endOfMonth = new Date(selectedYear, index + 1, 0);
            return checkOut >= startOfMonth && checkIn <= endOfMonth;
          });

          return (
            <div
              key={index}
              onClick={() => !isBookedMonth && setSelectedMonth(index)}
              className={`p-5 rounded-lg font-bold cursor-pointer transition shadow ${
                isBookedMonth
                  ? "bg-red-500 text-white cursor-not-allowed"
                  : selectedMonth === index
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              title={isBookedMonth ? "Booked" : "Available"}
            >
              {monthName}
            </div>
          );
        })}
      </div>

      {selectedMonth !== null && (
        <div className="mt-6 p-6 bg-white border rounded-xl shadow-lg space-y-3">
          <h3 className="text-lg font-semibold">Confirm Monthly Booking</h3>
          <p>Selected: <strong>{monthNames[selectedMonth]} {selectedYear}</strong></p>
          <p className="text-green-700 font-bold">Amount: ₹{calculateMonthlyAmount()}</p>
          <button
            onClick={handleBookingSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
            disabled={!razorpayLoaded}
          >
            Confirm Booking
          </button>
        </div>
      )}
    </>
  );

  if (propertiesLoading || loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
      {propertyCategory ? (
        propertyCategory === "resort" ? renderResortCalendar() : renderNonResortCalendar()
      ) : (
        <p className="text-center text-gray-600">Property details not available. Please try again.</p>
      )}
      <div className="mt-8 flex justify-center gap-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-sm" />
          <span>Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-sm" />
          <span>Available</span>
        </div>
      </div>
      {showInvoice && bookingDetails && (
        <InvoiceBill
          bookingDetails={bookingDetails}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
};

export default BookingList;