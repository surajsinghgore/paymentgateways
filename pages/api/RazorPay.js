// https://dev.to/soumyadey/integrate-razorpay-in-your-react-app-2nib web help
// https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration/
const Razorpay = require("razorpay");
const crypto = require('crypto');


async function handler(req, res) {
if(req.method=="POST"){
let amount=Number(req.body.amount)

try {
        const instance = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_ID,
            key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        });

        const options = {
           amount: amount*100, // amount in smallest currency unit
            currency: "INR",
            receipt: crypto.randomBytes(10).toString('hex'),
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        return res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
}
}
export default handler

