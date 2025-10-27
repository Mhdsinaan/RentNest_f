import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Api/Api'; 

function MyBookings() {
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-gray-700 rounded-full animate-pulse"></div>
            <div className="absolute top-0 w-16 h-16 border-4 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Fetching Your Reservations</h3>
          <p className="text-gray-400">Hang tight, we're loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 mt-10">
        <div className="bg-gray-800 border border-red-500/20 rounded-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Something Went Wrong</h3>
            <p className="text-red-400 mb-6">{error}</p>
            <button 
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Reservations Found</h3>
          <p className="text-gray-400">Your booking history is empty. Start exploring and make your first reservation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 mt-18">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Reservations</h1>
              <p className="text-gray-400 mt-1">Track and manage your bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <div 
              key={booking.id}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 group"
              style={{
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInSlide 0.8s ease-out forwards'
              }}
            >
              <div className="md:flex">
                {/* Image Section */}
                <div className="md:w-80 md:flex-shrink-0">
                  {booking.listingRequest?.imageUrl ? (
                    <div className="h-64 md:h-full relative overflow-hidden">
                      <img
                        src={booking.listingRequest.imageUrl}
                        alt={booking.listingRequest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/20"></div>
                    </div>
                  ) : (
                    <div className="h-64 md:h-full bg-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span className="text-gray-400 text-sm">Image Not Available</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex flex-col h-full">
                    {/* Property Name & Location */}
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                        {booking.listingRequest?.name || 'Unnamed Property'}
                      </h2>
                      <div className="flex items-center text-gray-400">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span>{booking.listingRequest?.location || 'Unknown Location'}</span>
                      </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8h8a2 2 0 002-2v-8a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                          </svg>
                          <span className="text-gray-300 text-sm font-medium">Check-in Date</span>
                        </div>
                        <p className="text-white font-semibold">{formatDate(booking.checkInDate)}</p>
                      </div>

                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                          </svg>
                          <span className="text-gray-300 text-sm font-medium">Guests</span>
                        </div>
                        <p className="text-white font-semibold">
                          {booking.children} {booking.children === 1 ? 'Child' : 'Children'}
                        </p>
                      </div>

                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                          </svg>
                          <span className="text-gray-300 text-sm font-medium">Total Cost</span>
                        </div>
                        <p className="text-emerald-400 font-bold text-lg">₹{booking.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      <button
                        onClick={() => {
                          const ownerId = booking.listingRequest?.userId;
                          if (!ownerId) {
                            alert("Owner info not available");
                            return;
                          }
                          navigate(`/chat?ownerId=${ownerId}&bookingId=${booking.id}`);
                        }}
                        className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200 group/button"
                      >
                        <svg className="w-5 h-5 mr-2 group-hover/button:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        Contact Property Owner
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
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

export default MyBookings;