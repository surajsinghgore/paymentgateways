import PaytmChecksum from 'paytmchecksum'
let mkey=process.env.NEXT_PUBLIC_PAYTM_MERCHANT_KEY;
import paytmDatabaseSchema from "./Schema/Paytm";
import DbConnection from "./Middleware/DbConnect";

export default async function PostTransaction(req,res) {

try{
  DbConnection();

const data = new paytmDatabaseSchema({
        data:req.body
      });

await data.save();


var paytmChecksum = "";
var paytmParams = {};
const dataRecived=req.body;
console.log(req.body)
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
res.redirect(200,"http://localhost:3000")
 return res.status(201).json({status:"201"})
      }

// failure
 else if(req.body.STATUS=="TXN_FAILURE"){
console.log('failure')

res.redirect(302,"http://localhost:3000")
   res.status(400).json({status:"400"})

}
// pending
else{
console.log('pending')

res.redirect(302,"http://localhost:3000")
   res.status(201).json({status:"400"})
}


}
// tempring in payment with hash
 else {
console.log('temp')

	res.redirect(400,"http://localhost:3000")
   res.status(201).json({status:"400"})

}



}

catch(error){

console.log(error);
   res.status(501).json({ message: error, status: "501" });
}
}
