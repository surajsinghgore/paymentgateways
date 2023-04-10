import PaytmChecksum from 'paytmchecksum'
let mkey=process.env.NEXT_PUBLIC_PAYTM_MERCHANT_KEY;

import razorPayDatabaseSchema from "./Schema/RazorPay";
import DbConnection from "./Middleware/DbConnect";

export default async function PostTransaction(req,res) {

try{

var paytmChecksum = "";
var paytmParams = {};
const dataRecived=req.body;
for(var key in dataRecived){
if(key=="CHECKSUMHASH"){
paytmChecksum=dataRecived[key];
}
else{
paytmParams[key]=dataRecived[key];
}
}

var isVerifySignature = PaytmChecksum.verifySignature(paytmParams, mkey, paytmChecksum);
// success without any tempring
if (isVerifySignature) {
// success 
if(req.body.STATUS=="TXN_SUCCESS"){
console.log('success')

}
// failure
 else if(req.body.STATUS=="TXN_FAILURE"){
 
console.log('failed')

}
// pending
else{

console.log('pending')

}


}
// tempring in payment with hash
 else {
	res.redirect("/OrderFailed?tempering="+req.body,400)
   res.status(201).json({status:"400"})
    res.status(201).json({body:req.body,message:"tempring"})
}



}

catch(error){

console.log(error);
   res.status(501).json({ message: error, status: "501" });
}
}