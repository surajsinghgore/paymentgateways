import {  useRouter } from "next/router";
import React, { useEffect } from "react"; 
 
export default function StripeSuccess() { 
const router=useRouter();
const check=async()=>{
const sessionId=localStorage.getItem('token');
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/retrievestripe?sessionId=${sessionId}`)
await response.json(); 
if(response.status==201){
localStorage.removeItem('token')
router.push('/')
}
}
  
useEffect(()=>{

if(localStorage.getItem('token')!=undefined){
check();
}
},[])
  return ( 
    <> 
      <h2>Thanks for your order!</h2> 
      <h4>Your payment is successful.</h4> 
      <p> 
        We appreciate your business! If you have any questions, please email us 
        at 
       
      </p> 
      <div> 
      </div> 
    </> 
  ); 
} 
 
