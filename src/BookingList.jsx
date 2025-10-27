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
  const [showInvoice, setShowInvoice] = useState(false); 
  const [bookingDetails, setBookingDetails] = useState(null); 

  const userId = 1; 

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
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <button
          onClick={() =>
            currentMonth === 0
              ? (setCurrentMonth(11), setCurrentYear(currentYear - 1))
              : setCurrentMonth(currentMonth - 1)
          }
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        
        <button
          onClick={() =>
            currentMonth === 11
              ? (setCurrentMonth(0), setCurrentYear(currentYear + 1))
              : setCurrentMonth(currentMonth + 1)
          }
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 font-medium"
        >
          Next
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-bold text-gray-600 py-3 text-sm uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {generateCalendar().map((date, idx) => {
            if (!date) return <div key={idx} className="h-12"></div>;
            const booked = isBooked(date);
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            
            return (
              <div
                key={idx}
                onClick={() => handleDateClick(date)}
                className={`h-12 flex items-center justify-center rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                  booked
                    ? "bg-gradient-to-br from-red-400 to-red-500 text-white cursor-not-allowed shadow-md"
                    : isSelected
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                    : "bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-md hover:shadow-lg"
                }`}
                title={booked ? "Booked" : "Available"}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Details Panel */}
      {selectedDate && (
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Booking Details
            </h3>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">Check-in Date</label>
                <p className="text-lg font-semibold text-gray-800 mt-1">{selectedDate.toDateString()}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Amount</label>
                <p className="text-2xl font-bold text-green-600 mt-1">₹{calculateResortAmount().toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  min={selectedDate.toISOString().split("T")[0]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleBookingSubmit}
              disabled={!razorpayLoaded}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {razorpayLoaded ? "Confirm Booking & Pay" : "Loading Payment Gateway..."}
            </button>
          </div>
        </div>
      )}
    </>
  );

  const renderNonResortCalendar = () => (
    <>
      <div className="text-center mb-8 mt-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          Monthly Booking
        </h2>
        <p className="text-gray-600 text-lg">Select your preferred month for long-term stay</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {monthNames.map((monthName, index) => {
            const isBookedMonth = bookings.some((b) => {
              const checkIn = new Date(b.checkInDate);
              const checkOut = new Date(b.checkOutDate);
              const startOfMonth = new Date(selectedYear, index, 1);
              const endOfMonth = new Date(selectedYear, index + 1, 0);
              return checkOut >= startOfMonth && checkIn <= endOfMonth;
            });

            const isSelected = selectedMonth === index;

            return (
              <div
                key={index}
                onClick={() => !isBookedMonth && setSelectedMonth(index)}
                className={`p-6 rounded-xl font-bold cursor-pointer transition-all duration-200 transform hover:scale-105 text-center ${
                  isBookedMonth
                    ? "bg-gradient-to-br from-red-400 to-red-500 text-white cursor-not-allowed shadow-md"
                    : isSelected
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                    : "bg-gradient-to-br from-gray-100 to-gray-200 hover:from-blue-50 hover:to-blue-100 text-gray-700 hover:text-blue-600 shadow-md hover:shadow-lg border border-gray-200"
                }`}
                title={isBookedMonth ? "Booked" : "Available"}
              >
                <div className="text-lg font-bold">{monthName}</div>
                <div className="text-sm opacity-75 mt-1">{selectedYear}</div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedMonth !== null && (
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 ">
            <h3 className="text-xl font-bold text-white flex items-center ">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Monthly Booking Confirmation
            </h3>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">Selected Month</label>
                <p className="text-lg font-semibold text-gray-800 mt-1">{monthNames[selectedMonth]} {selectedYear}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">Monthly Rate</label>
                <p className="text-2xl font-bold text-green-600 mt-1">₹{calculateMonthlyAmount().toLocaleString()}</p>
              </div>
            </div>

            <button
              onClick={handleBookingSubmit}
              disabled={!razorpayLoaded}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {razorpayLoaded ? "Confirm Monthly Booking & Pay" : "Loading Payment Gateway..."}
            </button>
          </div>
        </div>
      )}
    </>
  );

  if (propertiesLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your booking options...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-red-200 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        <div className="pt-8 pb-4">
          {propertyCategory ? (
            propertyCategory === "resort" ? renderResortCalendar() : renderNonResortCalendar()
          ) : (
            <div className="text-center bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Property Not Available</h3>
              <p className="text-gray-600">Property details not available. Please try again later.</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Booking Status Legend</h4>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-500 rounded-lg shadow-md"></div>
              <span className="font-medium text-gray-700">Booked</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-lg shadow-md"></div>
              <span className="font-medium text-gray-700">Available</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md"></div>
              <span className="font-medium text-gray-700">Selected</span>
            </div>
          </div>
        </div>

        {/* Invoice Modal */}
        {showInvoice && bookingDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Booking Invoice
                  </h3>
                  <button
                    onClick={() => setShowInvoice(false)}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <InvoiceBill
                bookingDetails={bookingDetails}
                onClose={() => setShowInvoice(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingList;