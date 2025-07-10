import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../Context/DataContext";

const PropertyList = () => {
  const { properties } = useContext(DataContext);

  if (!properties || properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 bg-white rounded-xl mx-4 my-8 p-8 shadow-sm">
        <div className="text-6xl mb-4">🏡</div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Properties Found</h3>
        <p className="text-gray-500 text-center max-w-md">
          We couldn't find any properties matching your criteria. Try adjusting your search or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
          Explore Our Properties
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Carefully selected homes and apartments for your perfect living space
        </p>
        <div className="w-20 h-0.5 bg-gray-200 mx-auto mt-6 rounded-full"></div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          if (!property?.id) return null;

          return (
            <Link
              key={property.id}
              to={`/PropertyDetails/${property.id}`}
              className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={property.imageUrl || 'https://via.placeholder.com/800x600?text=Property+Image'}
                  alt={property.name || 'Property'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600?text=Property+Image';
                  }}
                />
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  ₹{property.price?.toLocaleString('en-IN') || 'Contact'}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {property.name}
                  </h3>
                  {property.category && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {property.category}
                    </span>
                  )}
                </div>
                
                {/* Location */}
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{property.location}</span>

                  
                </div>
               <div className="mb-4">
  <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
  <p className="text-sm text-gray-600 truncate ml-10">{property.description}</p>
</div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-3"></div>

                {/* View Details Button */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                    View details
                  </span>
                  <svg className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <div className="bg-gray-50 rounded-xl p-8 max-w-2xl mx-auto border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Need help finding your perfect home?
          </h3>
          <p className="text-gray-500 mb-6">
            Our expert agents are ready to assist you in your property search.
          </p>
          <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200">
            Contact our team
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;