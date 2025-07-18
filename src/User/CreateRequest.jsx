import React, { useState } from "react";
import api from "../../Api/Api";
import { toast } from "sonner";

const CreateRequest = () => {
  const [formData, setFormData] = useState({
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
    e.preventDefault();

    try {
      // Get userId (either from localStorage or hardcode for now)
      const userId = localStorage.getItem("userId") || 1;

      const payload = {
        userId: parseInt(userId),
        name: formData.name,
        category: formData.category,
        imageUrl: formData.imageUrl,
        price: parseFloat(formData.price),
        priceUnit: priceUnitMap[formData.priceUnit], // convert string to int
        location: formData.location,
        description: formData.description,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms)
      };

      const response = await api.post("/api/ListingRequest", payload);

      if (response.status === 200) {
        toast.success("Property listing request submitted successfully.");
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
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to create request";
      toast.error(msg);
    }
  };

  const categories = ["Apartment", "Villa", "House", "Resort"];
  const locations = ["Areekode", "Kakkadampoyil", "Wayanad", "Kozhikkode", "Malappuram"];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create Property Listing Request
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Price Unit</label>
          <select
            name="priceUnit"
            value={formData.priceUnit}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="PerNight">Per Night</option>
            <option value="PerMonth">Per Month</option>
            <option value="PerWeek">Per Week</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Select Location --</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default CreateRequest;
