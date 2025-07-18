import React, { useEffect, useRef } from "react";

const InvoiceBill = ({ bookingDetails, onClose, properties }) => {
  const invoiceRef = useRef();

  useEffect(() => {
    if (!bookingDetails) {
      console.log("❌ bookingDetails is null or undefined.");
    } else {
      console.log("✅ bookingDetails:", bookingDetails);
      if (Object.keys(bookingDetails).length === 0) {
        console.log("⚠️ bookingDetails object is empty.");
      }
    }
  }, [bookingDetails]);

  const handleDownload = () => {
    const printContents = invoiceRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  if (
    !bookingDetails ||
    !bookingDetails.listingRequestId ||
    !bookingDetails.checkInDate ||
    !bookingDetails.checkOutDate
  ) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl w-full mx-4">
          <p className="text-red-600 text-center font-medium">
            Invalid or missing booking details.
          </p>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const property = properties?.find(
    (p) => p.id === parseInt(bookingDetails.listingRequestId)
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl w-full mx-4">
        <div ref={invoiceRef} className="text-gray-800 text-sm print:text-black p-6 border border-gray-300 rounded-lg shadow-inner">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-blue-700">Booking Invoice</h2>
            <p className="text-xs text-gray-500">Thank you for your booking!</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-sm mb-2">Invoice Details</h3>
              <p><span className="font-medium">Invoice ID:</span> #{bookingDetails.id}</p>
              <p><span className="font-medium">Date:</span> {bookingDetails.bookingDate}</p>
              <p><span className="font-medium">Status:</span> {bookingDetails.paymentStatus}</p>
            </div>

            {property && (
              <div>
                <h3 className="font-bold text-sm mb-2">Property Info</h3>
                <p><span className="font-medium">Name:</span> {property.propertyName}</p>
                <p><span className="font-medium">Location:</span> {property.location}</p>
                <p><span className="font-medium">Category:</span> {property.propertyCategory}</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-sm mb-2">Guest & Stay Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <p><span className="font-medium">Check-in:</span> {bookingDetails.checkInDate}</p>
              <p><span className="font-medium">Check-out:</span> {bookingDetails.checkOutDate}</p>
              <p><span className="font-medium">Adults:</span> {bookingDetails.adults}</p>
              <p><span className="font-medium">Children:</span> {bookingDetails.children}</p>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-lg font-bold text-right">
              Total Amount: <span className="text-green-700">₹{bookingDetails.amount}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4 no-print">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow-sm"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceBill;
