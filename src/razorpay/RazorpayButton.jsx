import React from "react";

const RazorpayButton = ({ amount, orderId, onSuccess, onError }) => {
  const loadScript = () =>
    new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const displayRazorpay = async () => {
    const res = await loadScript();

    if (!res) {
      onError("Failed to load Razorpay SDK");
      return;
    }

    if (!window.Razorpay) {
      onError("Razorpay SDK not available");
      return;
    }

    const options = {
      key: "rzp_test_xtcnIilH7t5YuD", // Your Razorpay Test Key ID
      amount: amount * 100, // in paise
      currency: "INR",
      name: "LaundryGo",
      description: "Booking Payment",
      order_id: orderId, // order id from backend
      handler: function (response) {
        onSuccess(response);
      },
      modal: {
        ondismiss: function () {
          onError("Payment popup closed");
        },
      },
      theme: {
        color: "#0d9488",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <button
      onClick={displayRazorpay}
      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
    >
      Pay ₹{amount}
    </button>
  );
};

export default RazorpayButton;
