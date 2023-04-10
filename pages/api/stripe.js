// artical link
// https://www.knowledgehut.com/blog/web-development/stripe-node-js
const express = require("express");
const app = express();
// const uuid=require('uuid')
// const idempontencyKey=uuid();

app.use(express.json());
// 1.0 require package and setup with publisher key
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SCERET_API_KEY);

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
    // require products from body
      const { product } = req.body;
      // amount get from body
      let price = Number(product.price) * 100;

// create checkout for strip [below is the complosary options]
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: product.name,
              },
              unit_amount: price,
            },
            quantity: product.quantity,
          },
        ],
        mode: "payment",
        success_url: `https://paymentgateways.onrender.com/StripeSuccess`,
        cancel_url: "https://paymentgateways.onrender.com/StripeCancel",
      });

      res.json({ id: session.id, session });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal server error" });
    }

    // return res.status(200).json({message:'successfully send'})
  } else {
    return res.status(400).json({ message: "Only POST REQUEST IS ALLOWED" });
  }
}
