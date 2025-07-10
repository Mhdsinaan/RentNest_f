import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

export default function Home() {
  const [searchData, setSearchData] = useState({
    place: '',
    propertyType: ''
  });

  const propertyTypes = [
    { value: '', label: 'All Property Types' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'Resort', label: 'Resort' },
    { value: 'villa', label: 'Villa' },
   
    
  ];

  const handleSearch = () => {
    console.log('Search data:', searchData);

  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section
      className="w-full h-screen bg-cover  bg-center flex flex-col justify-center items-center text-white relative  "
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1192403701/photo/residential-housing-background.jpg?s=612x612&w=0&k=20&c=8iquSynRiqeXDRaE53-0aKNEGe8y7RKslG2SoYwYGAQ=')",
      }}
    >
     
      <div className="absolute"></div>
      
      
      <div className="relative z-10 text-center mb-8">
  <div className=" bg-opacity-90 p-4 md:p-3 rounded-2xl shadow-lg inline-block">
    <h1 className="text-3xl md:text-5xl text-black font-bold mb-2">
      Find Your Dream Property
    </h1>
    
  </div>
</div>


      {/* Search Bar */}
      <div className="relative z-10 bg-white rounded-full shadow-2xl p-2 w-full max-w-2xl mx-4">
        <div className="flex items-center">
          {/* Location Input */}
          <div className="flex items-center flex-1 px-4 py-2">
            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Location"
              add dropdown
              value={searchData.place}
              onChange={(e) => handleInputChange('place', e.target.value)}
              className="w-full outline-none text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Property Type Select */}
          <div className="flex items-center px-4 py-2">
            <select
              value={searchData.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className="outline-none text-gray-900 bg-transparent"
            >
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}