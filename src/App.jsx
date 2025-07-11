import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner'; 
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import AdminDashboard from './Admin/AdminDashboard';
import CreateRequest from './User/createRequest';
import AllRequests from './Admin/AllRequests';
import PropertyList from './Pages/PropertyList';
import UpdateRequestStatus from './Admin/UpdateRequestStatus';
import Footer from './Pages/footer';
import PropertyDetails from './Pages/propertyDetails';
import BookingForm from './BookingForm';
import Profile from './User/Profile';
import MyBookings from './User/MyBookings';

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
      {path:'PropertyList',element:<PropertyList/>},
      { path:"PropertyDetails/:id" ,element: <PropertyDetails />} ,
      {path:'Profile',element:<Profile/>},
      {path:'MyBookings',element:<MyBookings/>}
      
      
    ],
  },
  { path: 'signup', element: <Registration /> },
  {path:'Login',element:<Login/>},
  {path:'CreateRequest',element:<CreateRequest/>},
  {path:"/booking/:id",element:<BookingForm/>},
  
  
 
  {
    path:'/AdminDashboard',
    element:<AdminDashboard/>,
    
    children:[
      {path:'AllRequests',element:<AllRequests/>},
      //  { path: "UpdateRequestStatus/:id", element: <UpdateRequestStatus /> }
      
    ]
  }
  
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
