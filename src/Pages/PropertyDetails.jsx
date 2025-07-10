import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import { Link } from "react-router-dom";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  // Booking form state (now simple, no modal)
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/ListingRequest/${id}`);
        if (res.data.statusCode === "200" && res.data.data.length > 0) {
          setProperty(res.data.data[0]);
        } else {
          setError("Property not found");
        }
      } catch (err) {
        setError("Failed to load property details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBooking = () => {
    // TODO: Call booking/payment API here
    console.log({
      propertyId: id,
      property: property.name,
    });
    alert("Booking initiated! (connect payment here)");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium text-gray-700">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors w-full max-w-xs mx-auto"
          >
            Return to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to properties
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Property Image Gallery */}
          <div className="relative">
            <img
              src={property.imageUrl || "https://via.placeholder.com/800x500?text=No+Image"}
              alt={property.name}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/800x500?text=No+Image";
              }}
            />
            <div className="absolute bottom-4 left-4 flex space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  property.status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {property.status === 1 ? "Available" : "Unavailable"}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {property.category}
              </span>
            </div>
          </div>

          {/* Property Content */}
          <div className="p-6 md:p-8">
            {/* Title and Price */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
              <div className="mt-2 md:mt-0">
                <span className="text-2xl font-semibold text-blue-600">
                  ₹{property.price?.toLocaleString("en-IN") || "Contact for price"}
                </span>
                <span className="text-gray-500 ml-1">/ night</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center mb-6">
              <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{property.location}</span>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "details"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("amenities")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "amenities"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Amenities
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {activeTab === "details" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">About this property</h3>
                  <p className="text-gray-600 leading-relaxed">{property.description || "No description available."}</p>
                </div>
              )}

              {activeTab === "amenities" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">What this place offers</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">WiFi</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Kitchen</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Free parking</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Air conditioning</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Button */}
            <div className="border-t border-gray-200 pt-6">
              <Link to={`/booking/${id}`}>
  <button
    disabled={property.status !== 1}
    className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
      property.status === 1
        ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
  >
    {property.status === 1 ? "Book Now" : "Currently Unavailable"}
  </button>
</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;