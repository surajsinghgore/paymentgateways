import mongoose from "mongoose";
let connectionUrl = process.env.NEXT_PUBLIC_MONGODB_URL;
mongoose.set("strictQuery", false);

const DbConnection = async (req, res) => {
try{
  let connectRes=await mongoose.connect(connectionUrl);

}
catch(e){
console.log(e)
return res.status(500).json({message:"Database Connection Error"})

}
};

export default DbConnection;
