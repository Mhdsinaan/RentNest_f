import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { DataContext } from "../Context/DataContext";

const PropertyList = () => {
  const { properties } = useContext(DataContext);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const placeFilter = queryParams.get("place")?.toLowerCase() || "";
  const typeFilter = queryParams.get("type")?.toLowerCase() || "";

  const filteredProperties =
    properties?.filter((property) => {
      const matchesPlace = placeFilter
        ? property.location?.toLowerCase().includes(placeFilter)
        : true;

      const matchesType = typeFilter
        ? property.category?.toLowerCase() === typeFilter
        : true;

      return matchesPlace && matchesType;
    }) || [];

  if (!filteredProperties.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse all available
              properties.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stylish Heading Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 mb-2">
          Explore Properties
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Find your perfect place to live, work, or relax. Filter by location and
          type to discover your ideal property.
        </p>
        <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
      </div>

      {/* Properties List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Properties</h2>
        <div className="space-y-4">
          {filteredProperties.map((property) => {
            if (!property?.id) return null;

            return (
              <Link
                key={property.id}
                to={`/PropertyDetails/${property.id}`}
                className="block bg-white rounded-lg border border-gray-200 hover:border-blue-600 transition-all duration-200 hover:shadow-md group overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-80 md:flex-shrink-0">
                    <div className="relative h-64 md:h-full">
                      <img
                        src={
                          property.imageUrl ||
                          "https://via.placeholder.com/320x240?text=Property+Image"
                        }
                        alt={property.name || "Property"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/320x240?text=Property+Image";
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                          <svg
                            className="w-4 h-4 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-blue-900 group-hover:text-blue-700 transition-colors">
                          {property.name}
                        </h3>
                        {property.category && (
                          <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {property.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-blue-600 text-sm mb-3">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="hover:underline">{property.location}</span>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {property.description}
                      </p>

                      {/* Amenities */}
                      {property.amenities?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {property.amenities.map((item, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded"
                            >
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">1 night, 2 adults</div>
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{property.price?.toLocaleString("en-IN") || "Contact"}
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-semibold transition-colors">
                          See availability
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
