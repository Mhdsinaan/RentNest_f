import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { DataContext } from "../Context/DataContext";

const PropertyList = () => {
  const { properties } = useContext(DataContext);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const placeFilter = queryParams.get("place")?.toLowerCase() || "";
  const typeFilter = queryParams.get("type")?.toLowerCase() || "";

  const filteredProperties = properties?.filter((property) => {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              {/* Empty for now */}
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              No Properties Found
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We couldn't find any properties matching your criteria. Try adjusting your search or check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="text-center">
            {/* Removed the home icon */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Explore Our Properties
            </h1>
            <p className="text-gray-600 text-lg">
              Find the perfect place to stay from our wide range of listings.
            </p>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => {
            if (!property?.id) return null;

            return (
              <Link
                key={property.id}
                to={`/PropertyDetails/${property.id}`}
                className="group block bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-blue-200/50 hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={property.imageUrl || 'https://via.placeholder.com/800x600?text=Property+Image'}
                    alt={property.name || 'Property'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x600?text=Property+Image';
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Price Badge */}
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                    ₹{property.price?.toLocaleString('en-IN') || 'Contact'}
                  </div>

                  {/* Category Badge */}
                  {property.category && (
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                      {property.category}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-2">
                      {property.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full mr-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="truncate">{property.location}</span>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {property.description}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 mb-4"></div>

                  {/* View Details Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                      View Details
                    </span>
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-50 group-hover:bg-blue-100 rounded-full transition-colors">
                      <svg className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
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
