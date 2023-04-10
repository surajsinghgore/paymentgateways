const https = require('https');
const PaytmChecksum = require('paytmchecksum');

let mid=process.env.NEXT_PUBLIC_PAYTM_MERCHANT_ID;
let mkey=process.env.NEXT_PUBLIC_PAYTM_MERCHANT_KEY;
let HOST=process.env.NEXT_PUBLIC_API_URL;

export default async function PreTransaction(req, res) {
  if (req.method == "POST") {
try{
    

let orderID=req.body.orderId;
let amount=req.body.amount;
let Email="surajthakurrs45@gmail.com"

var paytmParams = {};
paytmParams.body = {
    "requestType"   : "Payment",
    "mid"           : `${mid}`,
    "websiteName"   : "WEBSTAGING",
    "orderId"       : `${orderID}`,
    "callbackUrl"   : `${HOST}/api/PaytmPostTransaction`,
    "txnAmount"     : {
        "value"     : `${amount}`,
        "currency"  : "INR",
    },
    "userInfo"      : {
        "custId"    : `${Email}`,
    },
};


PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), `${mkey}`).then(function(checksum){

    paytmParams.head = {
        "signature"    : checksum
    };

    let post_data = JSON.stringify(paytmParams);

    let options = {

        /* for Staging */
        hostname: 'securegw-stage.paytm.in',

        /* for Production */
        // hostname: 'securegw.paytm.in',

        port: 443,
        path: `/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderID}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
          
let token=JSON.parse(response).body.txnToken;
return res.status(200).json(token)
        });
    });

    post_req.write(post_data);
    post_req.end();
});
 }
 catch(error){
  console.log(error);
   res.status(501).json({ message: error, status: "501" });
  }


  }

 
}
