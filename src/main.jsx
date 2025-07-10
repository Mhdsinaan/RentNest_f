import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DataProvider } from './Context/DataContext';
import './index.css';
import App from './App.jsx';
import './index.css';
import { UserProvider } from './Context/UserContext.jsx';




createRoot(document.getElementById('root')).render(
  <StrictMode>
     
    <DataProvider>
       < UserProvider>
      <App />
      </UserProvider>
    </DataProvider>
   
  </StrictMode>
);
