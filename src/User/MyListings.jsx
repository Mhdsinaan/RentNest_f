import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../Api/Api'; 

function MyListings() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        if (!token) {
          toast.error("Please login");
          navigate('/Login');
          return;
        }

        const payload = parseJwt(token);
        const userId = payload?.nameid;

        const response = await api.get(`/api/ListingRequest/approved/user/${userId}`);

        setList(response.data.data); 

      } catch (error) {
        console.error(error);
        toast.error("Failed to load listings or No list found");
      }
    };

    fetchListings();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto pt-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 mt-10">
            My Listings
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <p className="text-xl text-gray-500 font-medium">No listings found</p>
            <p className="text-gray-400 mt-2">Your approved listings will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {list.map((item, index) => (
              <div 
                key={item.id} 
                className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-indigo-600 rounded-full shadow-lg">
                      {item.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {item.location}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ₹{item.price?.toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Chat with Owner Button */}
                  <button
                    onClick={() => {
                      const ownerId = item.userId || item.ownerId;
                      if (!ownerId) {
                        toast.error("Owner info not available");
                        return;
                      }
                      navigate(`/chat?ownerId=${ownerId}&listingId=${item.id}`);
                    }}
                    className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-300"
                  >
                    Chat with Owner
                  </button>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyListings;
