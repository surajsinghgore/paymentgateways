import mongoose from "mongoose";

const razorPaySchema = new mongoose.Schema(
  {
    data: {},
  },
  { timestamps: true }
);

mongoose.models = {};

const razorPayDatabaseSchema =
  mongoose.models.razorPayDatabaseSchema ||
  mongoose.model("razorPayData", razorPaySchema);

export default razorPayDatabaseSchema;
