import React, { useEffect, useState } from 'react';
import api from '../../Api/Api'; // axios instance with auth header

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        if (!token) {
          setError("Please log in to view your bookings");
          setLoading(false);
          return;
        }

        const payload = parseJwt(token);
        const userId = payload?.nameid;

        if (!userId) {
          setError("Invalid user session");
          setLoading(false);
          return;
        }

        const response = await api.get(`/api/Booking/user`);
        setBookings(response.data.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Unable to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg font-medium">No bookings found.</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => window.location.href = '/book'}
          >
            Make a New Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">My Bookings</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bookings.map((booking) => (
            <div 
              key={booking.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Property image */}
              <div className="relative">
                {booking.listingRequest?.imageUrl ? (
                  <img
                    src={booking.listingRequest.imageUrl}
                    alt={booking.listingRequest.name}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {getBookingStatus(booking.bookingStatus)}
                </div>
              </div>
              <div className="p-6">
                {/* Property details */}
                <h3 className="text-xl font-semibold text-gray-900 truncate">{booking.listingRequest?.name || 'Unnamed Property'}</h3>
                <p className="text-sm text-gray-500 mt-1">{booking.listingRequest?.location || 'Unknown Location'}</p>

                {/* Booking details */}
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Check-in:</span> {formatDate(booking.checkInDate)}</p>
                  <p><span className="font-medium">Guests:</span> {booking.children} {booking.children === 1 ? 'Child' : 'Children'}</p>
                  <p><span className="font-medium">Total:</span> ₹{booking.totalAmount.toLocaleString()}</p>
                </div>

                {/* Action buttons */}
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getBookingStatus = (status) => {
  switch (status) {
    case 0: return 'Pending';
    case 1: return 'Confirmed';
    case 2: return 'Cancelled';
    case 3: return 'Completed';
    default: return 'Unknown';
  }
};



export default MyBookings;