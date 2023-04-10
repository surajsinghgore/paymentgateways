import Head from "next/head";
import Script from "next/script";
import { useState } from "react";
import styles from "../styles/Home.module.css";
// import Razorpay from 'razorpay';
import { loadStripe } from "@stripe/stripe-js";
 let d = new Date();
    // generate token
    let TokenId =
      Math.floor(Math.random() * 1000000000000000 + 1) +
      d.getDate() +
      d.getMonth() +
      d.getFullYear();
   
export default function Home() {
  const [amount, setAmount] = useState();
  const [stateManage, setStateManage] = useState(false);
  const [product, setProduct] = useState({
    name: "Go FullStack with KnowledgeHut",
    price: 0,
    productOwner: "KnowledgeHut",
    description:
      "This beginner-friendly Full-Stack Web Development Course is offered online in blended learning mode, and also in an on-demand self-paced format.",
    quantity: 1,
  });

  // amount get from input box
  const inputValueChange = (e) => {
    setAmount(e.target.value);
    product.price = e.target.value;
    {
      e.target.value > 0 ? setStateManage(true) : setStateManage(false);
    }
  };
  // stripe payment request api
  const makePaymentStripe = async () => {
    setStateManage(false);
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
    const body = { product };
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stripe`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    setStateManage(true);

    const session = await response.json();
    localStorage.setItem("token", session.id);
    console.log(session);
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    console.log(result);

    if (result.error) {
      console.log(result.error);
    }
  };

  // make payment using razorpay
  const makeRazorPayment = async (amounts) => {
    // creating a new order
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/RazorPay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amounts }),
    });
    const result = await res.json();

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    // Getting the order details back
    const { amount, id, currency } = result;
    console.log(id);
    const options = {
      key: "rzp_test_IUolk6jDznYfGU", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Soumya Corp.",
      description: "Test Transaction",
      image:
        "https://res.cloudinary.com/dnxv21hr0/image/upload/v1679195234/with_out_bg_-_Copy_oz607u.png",
      order_id: id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      // only when successfully payment
      handler: async function (response) {
        const data = {
          orderId: id,
          razorpayPaymentId: response.razorpay_order_id,
          razorpayOrderId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/RazorPaySuccess`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
         await res.json();


        // alert(result1.data.msg);
      },
      prefill: {
        name: "Soumya Dey",
        email: "SoumyaDey@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Soumya Dey Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
    // handling if failure occure in payment
    paymentObject.on("payment.failed", function (response) {
      alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
      alert("payment failed");
    });
  };

 
  // make paytm payment
  const makePaytmPayment = async (amounts) => {
   
    let ress = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/PaytmPreTransaction`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          orderId: TokenId,
          amount: amounts,
        }),
      }
    );
    let txnToken = await ress.json();

    //               // setOrderId(datas.token)
    var config = {
             "root": "",
             "flow": "DEFAULT",
             "data": {
              "orderId": TokenId,
              "token": txnToken,
              "tokenType": "TXN_TOKEN",
              "amount":amounts
             },
             "handler": {
                "notifyMerchant": function(eventName,data){
                  console.log(eventName,data)
                }
              }
            };
                  window.Paytm.CheckoutJS.init(config).then(function onSuccess() {

    window.Paytm.CheckoutJS.invoke();
    }).catch(function onError(error){
    console.log("error => ",error);
    });
  };

  // onsubmit request from button
  const check = (e) => {
    let checkboxcheckvalue;
    e.preventDefault();
    // fetching radio button option selected by user
    let valueInCheckBox = document.getElementsByName("paymentMethod");
    for (let i = 0; i < valueInCheckBox.length; i++) {
      if (valueInCheckBox[i].checked) {
        checkboxcheckvalue = valueInCheckBox[i].value;
      }
    }
    // check wheather any payment method is selected or not
    if (checkboxcheckvalue == undefined) {
      alert("please select any payment method");
      return;
    }

    // check weather amount is not below 0 or 0
    if (stateManage) {
      // stripe payment initiate
      if (checkboxcheckvalue == "stripe") {
        makePaymentStripe();
      } else if (checkboxcheckvalue == "razorpay") {
        makeRazorPayment(amount);
      } else if (checkboxcheckvalue == "ccAvenue") {
        makeCcAvenue(amount);
      } else if (checkboxcheckvalue == "paytm") {
        makePaytmPayment(amount);
      }
    } else {
      alert("Please Select amount");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>DONATE TO PRP WEBSITE</title>
        <meta name="description" content="DONATE TO PRP WEBSITE" />
        <link rel="icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>

      {/* paytm script */}

        
    <Script type="application/javascript" src={`https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MERCHANT_ID}.js`} crossorigin="anonymous"></Script>
 <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <form onSubmit={check}>
        <input
          type="number"
          name="amount"
          id="amount"
          placeholder="Enter Amount"
          value={amount}
          onChange={inputValueChange}
        />

        {/* cards option */}
        <p id="message">Select any gateway for payment</p>
        <div className="card">
         

          <li>
            <input
              type="radio"
              name="paymentMethod"
              value="razorpay"
              id="razorpay"
            />
            <label htmlFor="razorpay">
              <img src="razorpay.png" alt="razorpay" id="razorpayImg" />
            </label>
          </li>

         
          <li>
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              id="stripe"
            />
            <label htmlFor="stripe">
              <img src="stripe.png" alt="stripe" id="stripeImg" />
            </label>
          </li>

          <li>
            <input type="radio" name="paymentMethod" value="paytm" id="paytm" />
            <label htmlFor="paytm">
              <img src="paytm.png" alt="paytm" id="paytmImg" />
            </label>
          </li>

         
        </div>

        {/* button */}
        {stateManage ? (
          <button className="btn-hover color-1" onClick={check}>
            Donate Now
          </button>
        ) : (
          <button className="btn-hover color-1 disable">Donate Now</button>
        )}
      </form>
    </div>
  );
}
