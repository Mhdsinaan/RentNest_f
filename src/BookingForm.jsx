import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Api/Api";
import { DataContext } from "./Context/DataContext";
import { toast } from "sonner";

const BookingForm = () => {
  const { id } = useParams();
  const { properties } = useContext(DataContext);

  const navigate=useNavigate();

  const matchedProperty = properties?.find(
    (p) => p.propertyId === id || p.propertyId === String(id)
  );

  const listingRequestIdFromProperties = matchedProperty
    ? Number(matchedProperty.propertyId)
    : Number(id) || 0;

  const [formData, setFormData] = useState({
    listingRequestId: listingRequestIdFromProperties,
    checkInDate: "",
    checkOutDate: "",
    adults: 0,
    children: 0,
  });

  useEffect(() => {
    if (matchedProperty) {
      setFormData((prev) => ({
        ...prev,
        listingRequestId: Number(matchedProperty.propertyId),
      }));
    } else if (id) {
      setFormData((prev) => ({
        ...prev,
        listingRequestId: Number(id),
      }));
    }
  }, [id, matchedProperty]);

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["adults", "children"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    const bookingData = {
      ...formData,
      checkInDate: new Date(formData.checkInDate).toISOString(),
      checkOutDate: new Date(formData.checkOutDate).toISOString(),
    };

    console.log("Sending booking data:", bookingData);
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const { data } = await api.post("/api/Booking", bookingData);
      setResponse(data);
      toast.success("Booking sucessfully");
      navigate('/');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Something went wrong");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Book Your Stay</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Check-In Date:</label>
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Check-Out Date:</label>
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Adults:</label>
          <input
            type="number"
            name="adults"
            min="0"
            value={formData.adults}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Children:</label>
          <input
            type="number"
            name="children"
            min="0"
            value={formData.children}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      
    </div>
  );
};

export default BookingForm;
