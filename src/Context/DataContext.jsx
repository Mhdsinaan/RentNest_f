import React, { createContext, useState, useEffect } from 'react';
import api from '../../Api/Api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const fetchProperties = async () => {
  try {
    setLoading(true);
    const response = await api.get('/api/ListingRequest/Approved');
    setProperties(response.data.data); 
  } catch (err) {
    setError('Failed to fetch properties.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <DataContext.Provider value={{ properties, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};
