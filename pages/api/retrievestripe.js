
// this page is used to information from from stripe to db
import Stripe from 'stripe';
import stripeDatabaseSchema from "./Schema/Stripe";

import DbConnection from "./Middleware/DbConnect";
const stripe=new Stripe
(process.env.NEXT_PUBLIC_STRIPE_SCERET_API_KEY)

export default async function retrievestripe(req,res) {
 if(req.method=='GET'){
 try{
 DbConnection();

const {sessionId}=req.query;
if(!sessionId.startsWith('cs_')){
return res.status(500).json({message:'incorrect checkout session id'})
} 
const checkoutsession=await stripe.checkout.sessions.retrieve(sessionId);


if(checkoutsession){
let getData=await stripeDatabaseSchema.find({"data.id":`${checkoutsession.id}`});

if(getData.length===0){
 const data = new stripeDatabaseSchema({
        data: checkoutsession,
      });
       await data.save();
}
return res.status(201).json({message:'Successfully payment made'})
}else{
return res.status(500).json({message:"Internal server error"})

}

 }
 catch(e){
 console.log(e);
return res.status(500).json({message:"Internal server error"})

 }
 }
}
