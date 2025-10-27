import React, { useState } from "react";

const CreateRequest = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    imageUrl: "",
    price: "",
    priceUnit: "",
    location: "",
    description: "",
    bedrooms: "",
    bathrooms: ""
  });

  const priceUnitMap = {
    PerNight: 0,
    PerMonth: 1,
    PerWeek: 2,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {

    try {
      
      const userId = 1; 

      const payload = {
        userId: parseInt(userId),
        name: formData.name,
        category: formData.category,
        imageUrl: formData.imageUrl,
        price: parseFloat(formData.price),
        priceUnit: priceUnitMap[formData.priceUnit], 
        location: formData.location,
        description: formData.description,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms)
      };

      
      console.log("Payload:", payload);
      alert("Property listing request submitted successfully!");
      setFormData({
        name: "",
        category: "",
        imageUrl: "",
        price: "",
        priceUnit: "PerNight",
        location: "",
        description: "",
        bedrooms: "",
        bathrooms: ""
      });
    } catch (err) {
      const msg = "Failed to create request";
      alert(msg);
    }
  };

  const categories = ["Apartment", "Villa", "House", "Resort"];
  const locations = ["Areekode", "Kakkadampoyil", "Wayanad", "Kozhikkode", "Malappuram"];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="w-full max-w-none ">
        {/* Header Section */}
        <div className="text-center mb-8 ">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg mt-12">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Create Property Listing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Submit your property details and let us help you find the perfect guests
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
        </div>

        {/* Form Card */}
        <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 lg:p-12">
          <div className="space-y-8">
            {/* Property Name - Full Width */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                Property Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter property name"
                className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:bg-white"
              />
            </div>

            {/* Category, Location, and Image URL Row - Three Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Choose category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Choose location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="group md:col-span-2 lg:col-span-1">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Property Image URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:bg-white"
                />
              </div>
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:bg-white"
                />
              </div>

              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Pricing Unit
                </label>
                <select
                  name="priceUnit"
                  value={formData.priceUnit}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:bg-white appearance-none cursor-pointer"
                >
                  <option value="PerNight">Per Night</option>
                  <option value="PerMonth">Per Month</option>
                  <option value="PerWeek">Per Week</option>
                </select>
              </div>

              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 18h10a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:bg-white"
                />
              </div>

              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                  </svg>
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:bg-white"
                />
              </div>
            </div>

           
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/>
                </svg>
                Property Description
              </label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property's features, amenities, and what makes it special..."
                className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:bg-white resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6 flex justify-center">
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 min-w-[300px]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                <span>Submit Property Request</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Your listing request will be reviewed within 24-48 hours. We'll notify you once it's approved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;