// YourBillingComponent.jsx
import Script from "next/script";
export default function YourBillingComponent() {
  const makePayment = async ({ productId = null }) => {
    // Make API call to the serverless API
    const data = await fetch("/api/razorpay", {
      method: "POST",
      headers: {
        // Authorization: 'YOUR_AUTH_HERE'
      },
      body: JSON.stringify({ productId }),
    }).then((t) => t.json());
    const options = {
      name: data.name,
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      description: data.amountDesc,
      // image: logoBase64,
      handler: function (response) {
        // Validate payment at server - using webhooks is a better idea.
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
      },
      prefill: {
        name: "John Doe",
        email: "jdoe@example.com",
        contact: "9876543210",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function (response) {
      alert("Payment failed. Please try again. Contact support for help");
    });
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <button
        onClick={() => {
          makePayment({ productId: "example_ebook" });
        }}
      >
        Buy
      </button>
    </>
  );
}
