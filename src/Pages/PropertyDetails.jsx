
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../Api/Api";


const BackArrowIcon = () => (
  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5 mr-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-20 h-20 mx-auto text-orange-500 mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

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
    console.log({
      propertyId: id,
      property: property.name,
    });
    alert("Booking initiated! (connect payment here)");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-t-indigo-600 border-r-indigo-600 rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <p className="text-xl font-medium text-slate-700 mb-2">Loading Property Details</p>
            <p className="text-sm text-slate-500">Please wait a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-200">
          <WarningIcon />
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Oops! Something went wrong</h3>
          <p className="text-slate-600 text-base leading-relaxed mb-8">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            Go Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Minimal Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-700 hover:text-indigo-600 transition-colors duration-200 font-medium px-3 py-2 rounded-xl hover:bg-slate-100"
            >
              <BackArrowIcon />
              Back to Properties
            </button>
           
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image Section */}
        <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={property.imageUrl || "https://via.placeholder.com/1200x500?text=Beautiful+Property"}
            alt={property.name}
            className="w-full h-[60vh] object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/1200x500?text=Image+Not+Available";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Floating Status Badges */}
          <div className="absolute top-6 left-6 flex flex-wrap gap-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md shadow-lg ${
                property.status === 1 
                  ? "bg-emerald-500/90 text-white" 
                  : "bg-red-500/90 text-white"
              }`}
            >
              {property.status === 1 ? "✓ Available" : "⏳ Occupied"}
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-indigo-500/90 text-white backdrop-blur-md shadow-lg">
              {property.category}
            </span>
          </div>

          {/* Property Title Overlay */}
          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {property.name}
            </h1>
            <div className="flex items-center text-white/90 text-lg mb-4">
              <LocationIcon />
              <span className="font-medium">{property.location}</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-900">
                  ₹{property.price?.toLocaleString("en-IN") || "Price on Request"}
                </span>
                <span className="text-slate-600 text-lg">per night</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                    activeTab === "details"
                      ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  Property Details
                </button>
                <button
                  onClick={() => setActiveTab("amenities")}
                  className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                    activeTab === "amenities"
                      ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  Amenities
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === "details" && (
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">About This Property</h3>
                    <p className="text-slate-700 leading-relaxed text-lg">
                      {property.description || "Experience the perfect blend of comfort and elegance in this beautifully appointed property. Located in the heart of Manjeri, this space offers everything you need for a memorable stay, whether for business or leisure."}
                    </p>
                  </div>
                )}

                {activeTab === "amenities" && (
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Featured Amenities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "High-Speed Wi-Fi",
                        "Fully Equipped Kitchen",
                        "Free Parking",
                        "Air Conditioning",
                        "Workspace Area",
                        "Fresh Linens & Towels",
                        "Power Backup",
                        "Local Support",
                      ].map((amenity, index) => (
                        <div key={index} className="flex items-center text-slate-700">
                          <CheckCircleIcon />
                          <span className="font-medium">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 sticky top-24">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Reserve Your Stay
              </h3>
              
              <div className="space-y-6">
               

                <Link to={`/booking/${id}`}>
                  <button
                    disabled={property.status !== 1}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                      property.status === 1
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 active:scale-95"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {property.status === 1 ? "Book Now" : "Currently Unavailable"}
                  </button>
                </Link>

                <div className="text-center pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    Questions? {" "}
                    <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                      Contact Support
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;
