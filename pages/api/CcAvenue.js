
var ccavenue = require('ccavenue-iframe')
ccavenue.merchantId(process.env.NEXT_PUBLIC_CC_AVENUE_MERCHANT_ID);    // Add Merchant Id Provided by CCAVENUE
ccavenue.workingKey(process.env.NEXT_PUBLIC_CC_AVENUE_WORKING_KEY );	  // Add Working Key Id Provided by CCAVENUE
ccavenue.accessCode(process.env.NEXT_PUBLIC_CC_AVENUE_ACCESS_CODE);	  // Add Access Code Provided by CCAVENUE
ccavenue.redirectUrl('http://localhost:3000/api/RedirectCcAvenue');   // Add Your Redirect Url
 
async function handler(req, res) {
if(req.method=="POST"){
let amount=Number(req.body.amount)

try {
  
 var data= {
              order_id: 'oid',
              currency: 'AED',
              amount: amount,
              language: 'EN',
              billing_name: 'Rohit',
              billing_address: 'Bangalore',
              billing_city: 'Bangalore',
              billing_state: 'Karnataka',
              billing_zip: '333333',
              billing_country: 'India',
              billing_tel: '1234567890',
              billing_email: 'testing@gmail.com',
              integration_type: 'iframe_normal'   // Do not Change this Value
          }



 ccavenue.makePayment(data,req,res);


    } catch (error) {
    console.log(error)

        res.status(500).send(error);
    }
}
}
export default handler

