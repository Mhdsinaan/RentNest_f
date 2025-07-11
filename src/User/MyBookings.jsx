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
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const payload = parseJwt(token);
        const userId = payload?.nameid;

        if (!userId) {
          setError("Invalid user token");
          setLoading(false);
          return;
        }

        const response = await api.get(`/api/Booking/${userId}`);
        setBookings(response.data.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // same getBookingStatus, getPaymentStatus, formatDate functions from earlier

  if (loading) return <div className="mt-20 text-center">Loading...</div>;
  if (error) return <div className="mt-20 text-center text-red-500">{error}</div>;
  if (bookings.length === 0) return <div className="mt-20 text-center">No bookings found.</div>;

  return (
    <div className="mt-20 p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Bookings</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="border rounded-xl p-4 shadow bg-white">
            <p><strong>Booking ID:</strong> #{booking.id}</p>
            <p><strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
            <p><strong>Adults:</strong> {booking.adults}</p>
            <p><strong>Children:</strong> {booking.children}</p>
            <p><strong>Total:</strong> ₹{booking.totalAmount}</p>
            <p><strong>Status:</strong> {getBookingStatus(booking.bookingStatus)}</p>
            <p><strong>Payment:</strong> {getPaymentStatus(booking.paymentStatus)}</p>
          </div>
        ))}
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

const getBookingStatus = (status) => {
  switch (status) {
    case 0: return 'Pending';
    case 1: return 'Confirmed';
    case 2: return 'Cancelled';
    case 3: return 'Completed';
    default: return 'Unknown';
  }
};

const getPaymentStatus = (status) => {
  switch (status) {
    case 0: return 'Pending';
    case 1: return 'Paid';
    case 2: return 'Failed';
    default: return 'Unknown';
  }
};

export default MyBookings;
