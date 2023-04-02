// const crypto = require('crypto');
import razorPayDatabaseSchema from "./Schema/RazorPay";
import DbConnection from "./Middleware/DbConnect";

export default async function RazorPaySuccess(req, res) {
  if (req.method == "POST") {
    try {
      DbConnection();
      var crypto = require("crypto");
      const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
        req.body;

      const data = new razorPayDatabaseSchema({
        data: {
          orderId,
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
        },
      });


      const saveData = await data.save();


 let body=razorpayPaymentId + "|" + razorpayPaymentId;

      // Pass yours key_secret here
      const key_secret = "RKRlwqkxBLp9LmlAqePMmIi6";

      var expectedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(body.toString())
        .digest("hex");

      console.log("sig received ", razorpaySignature);
      console.log("sig generated ", expectedSignature);
      var response = { signatureIsValid: "false" };
      if (expectedSignature === razorpaySignature) {
        response = { signatureIsValid: "true" };
      }

      res.send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}
