import React from "react";

const InvoiceModal = ({ bookingDetails, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default InvoiceModal;
