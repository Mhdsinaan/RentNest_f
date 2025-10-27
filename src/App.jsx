import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner'; 
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import AdminDashboard from './Admin/AdminDashboard';
import AllRequests from './Admin/AllRequests';
import PropertyList from './Pages/PropertyList';
import UpdateRequestStatus from './Admin/UpdateRequestStatus';
import Footer from './Pages/Footer';
import PropertyDetails from './Pages/PropertyDetails'; // ✅ Fixed case
import BookingList from './BookingList';
import RazorpayButton from './razorpay/RazorpayButton';
import ChatPage from './ChatPage';

import Profile from './User/Profile';
import MyBookings from './User/MyBookings';
import Users from './Admin/Users';
import Analytics from './Admin/Analytics';
import MyListings from './User/MyListings';
import Chat from './User/Chat';
import CreateRequest from "./User/CreateRequest";


function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'PropertyList', element: <PropertyList /> },
      { path: 'PropertyDetails/:id', element: <PropertyDetails /> },
      { path: 'Profile', element: <Profile /> },
      { path: 'MyBookings', element: <MyBookings /> },
      { path: 'CreateRequest', element: <CreateRequest /> },
      { path: 'RazorpayButton', element: <RazorpayButton /> },
      { path: 'booking/:id', element: <BookingList /> },
      { path: 'MyListing', element: <MyListings /> },
      { path: 'chat', element: <ChatPage /> },
    ],
  },
  { path: 'signup', element: <Registration /> },
  { path: 'Login', element: <Login /> },

  {
    path: '/AdminDashboard',
    element: <AdminDashboard />,
    children: [
      { path: 'AllRequests', element: <AllRequests /> },
      { path: 'Users', element: <Users /> },
      { path: 'Analytics', element: <Analytics /> },
      { path: 'UpdateRequestStatus/:id', element: <UpdateRequestStatus /> }, // ✅ uncommented & fixed
    ],
  },
]);

function App() {
  return (
    <>
      <Toaster position="top-center" richColors /> 
      <RouterProvider router={router} />
    </>
  );
}

export default App;
