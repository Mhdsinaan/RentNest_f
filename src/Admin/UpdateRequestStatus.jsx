import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Api/Api";

const statusMap = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
};

const statusReverseMap = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
};

const UpdateRequestStatus = () => {
  const { id } = useParams(); // id is RequestId or UserId depending on your API
  const navigate = useNavigate();

  const [status, setStatus] = useState("Pending");
  const [adminResponse, setAdminResponse] = useState("");
  const [requestDetails, setRequestDetails] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/ListingRequest/UserById", {
          params: { UserId: id },
        });
        const data = res.data.data;
        setRequestDetails(data);
        setStatus(statusMap[data.status] || "Pending");
        setAdminResponse(data.adminResponse || "");
        setError(null);
      } catch (err) {
        setError("Failed to load request details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await api.put(`/api/ListingRequest/status/${id}`, null, {
        params: {
          status: statusReverseMap[status],
          adminResponse,
        },
      });
      setSuccessMsg("Request status updated successfully!");
      setError(null);
      setTimeout(() => navigate("/AdminDashboard/AllRequests"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed!";
      setError(msg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading request details...</p>;
  }

  if (!requestDetails) {
    return <p className="text-center mt-10 text-red-500">No request found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Update Request Status
      </h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {successMsg && <p className="text-green-600 mb-4 text-center">{successMsg}</p>}

      <div className="mb-4">
        <label className="block font-medium mb-1">Request Name</label>
        <p className="bg-gray-100 p-2 rounded">{requestDetails.name}</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Category</label>
        <p className="bg-gray-100 p-2 rounded">{requestDetails.category}</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Price</label>
        <p className="bg-gray-100 p-2 rounded">₹{requestDetails.price}</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Location</label>
        <p className="bg-gray-100 p-2 rounded">{requestDetails.location}</p>
      </div>

      {requestDetails.imageUrl && (
        <div className="mb-4">
          <label className="block font-medium mb-1">Image</label>
          <img
            src={requestDetails.imageUrl}
            alt="Request"
            className="w-full max-h-64 object-cover rounded border"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block font-medium mb-1">Current Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2"
          disabled={updating}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Admin Response</label>
        <textarea
          value={adminResponse}
          onChange={(e) => setAdminResponse(e.target.value)}
          rows="4"
          placeholder="Enter your response..."
          className="w-full border rounded px-3 py-2"
          disabled={updating}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Request Date</label>
        <p className="bg-gray-100 p-2 rounded">
          {requestDetails.requestDate &&
          requestDetails.requestDate !== "0001-01-01T00:00:00"
            ? new Date(requestDetails.requestDate).toLocaleDateString()
            : "No request date available"}
        </p>
      </div>

      <button
        onClick={handleUpdate}
        disabled={updating}
        className={`w-full px-4 py-2 rounded text-white ${
          updating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {updating ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
};

export default UpdateRequestStatus;
